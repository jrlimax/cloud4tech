import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import unquote, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener, urlopen
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description="Validate site files; optionally check a running preview.")
parser.add_argument("--base-url", help="Preview origin, for example http://127.0.0.1:8787")
args = parser.parse_args()
ROOT = Path(__file__).resolve().parents[1]
BASE = args.base_url.rstrip("/") if args.base_url else None
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"}


class Node:
    def __init__(self, tag, attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def text(self):
        return "".join(c.text() if isinstance(c, Node) else c for c in self.children)

    def find(self, tag):
        return [n for c in self.children if isinstance(c, Node)
                for n in ([c] if c.tag == tag else []) + c.find(tag)]


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def normalized(text):
    return " ".join(text.split())


docs = {p: Document(p.read_text(encoding="utf-8")).root for p in ROOT.glob("*.html")}
expected = [
    ("/ir-para-nuvem", "Ir para a nuvem"),
    ("/cloud-gerenciada", "Gerenciar serviços em nuvem"),
    ("/microsoft-365", "Organizar e-mails e acessos"),
    ("/acronis", "Proteger e recuperar dados"),
]
faqs = links = schemas = 0
def footer_signature(node):
    return (node.tag, sorted(node.attrs.items()),
            [footer_signature(c) if isinstance(c, Node) else normalized(c)
             for c in node.children if isinstance(c, Node) or normalized(c)])

expected_footer = footer_signature(docs[ROOT / "index.html"].find("footer")[0])
asset_versions = {}
for path, doc in docs.items():
    if path.name != "google1e996c26b941f425.html":
        footers = doc.find("footer")
        assert len(footers) == 1, f"Missing or duplicate footer: {path.name}"
        assert footer_signature(footers[0]) == expected_footer, f"Footer mismatch: {path.name}"
    for script in doc.find("script"):
        if script.attrs.get("type") != "application/ld+json":
            continue
        data = json.loads(script.text())
        schemas += 1
        for entity in data.get("@graph", [data]):
            if entity.get("@type") == "FAQPage":
                actual = [(normalized(d.find("summary")[0].text()),
                           normalized(" ".join(p.text() for p in d.find("p"))))
                          for d in doc.find("details")]
                declared = [(q["name"], q["acceptedAnswer"]["text"])
                            for q in entity["mainEntity"]]
                assert actual == declared, f"FAQ/schema mismatch: {path.name}"
                faqs += 1
    menus = [d for d in doc.find("div")
             if d.attrs.get("class") == "nav-dropdown__menu"]
    if menus:
        assert [(a.attrs["href"], normalized(a.text()))
                for a in menus[0].find("a")] == expected, path.name
        assert len(menus[1].find("a")) == 5, path.name
        nav = [n for n in doc.find("ul") if n.attrs.get("id") == "navLinks"][0]
        assert [normalized(n.find("a")[0].text()) for n in nav.find("li")] == [
            "Soluções", "Tecnologias", "Sobre", "Contato"
        ], path.name
    for node in doc.find("a") + doc.find("link") + doc.find("script") + doc.find("img"):
        href = node.attrs.get("href", node.attrs.get("src", ""))
        url = urlsplit(href)
        if url.path.startswith("/assets/") and url.path.endswith((".css", ".js")):
            asset_versions.setdefault(url.path, set()).add(url.query)
        if url.scheme or url.netloc or not href:
            continue
        relative = unquote(url.path).lstrip("/")
        target = ROOT / relative if relative else path
        if url.path == "/":
            target = ROOT / "index.html"
        elif not target.suffix and not target.is_file():
            target = target.with_suffix(".html")
        assert target.is_file(), f"Broken link {path.name}: {href}"
        if url.fragment and target.suffix == ".html":
            ids = {n.attrs.get("id") for tag in
                   ("main", "nav", "header", "section", "div", "h1", "h2", "input", "form")
                   for n in docs[target].find(tag)}
            assert url.fragment in ids, f"Missing anchor {path.name}: {href}"
        links += 1
        srcset = node.attrs.get("srcset", node.attrs.get("imagesrcset", ""))
        for candidate in srcset.split(","):
            if candidate.strip():
                asset = candidate.split()[0]
                assert (ROOT / asset.lstrip("/")).is_file(), f"Broken srcset {path.name}: {asset}"
    source = path.read_text(encoding="utf-8")
    assert not re.search(r"Sophos|Fortinet|Defender|\bEDR\b|\bXDR\b|ciberseguran|Autopilot|certifica.{0,20}Acronis",
                         source, re.I), f"Retired claim: {path.name}"

assert all(len(versions) == 1 for versions in asset_versions.values()), asset_versions
for size, limit in ((96, 10000), (192, 20000), (320, 35000), (640, 80000)):
    image = ROOT / "assets" / "images" / f"falcon-tech-{size}.webp"
    data = image.read_bytes()
    assert data[:4] == b"RIFF" and data[8:12] == b"WEBP", image.name
    assert len(data) < limit, f"Image weight budget exceeded: {image.name}"

assert faqs == 7, faqs
cloud_faq = docs[ROOT / "ir-para-nuvem.html"].find("details")
assert [d.find("summary")[0].text() for d in cloud_faq] == [
    "Preciso migrar tudo de uma vez?",
    "Minha empresa precisa ter uma equipe de TI interna?",
    "Quem paga o consumo da nuvem?",
    "Quem administra o ambiente depois da implantação?",
]
assert "O que acontece com os acessos ao encerrar o contrato?" in docs[ROOT / "cloud-gerenciada.html"].text()
for name in ("sobre.html", "contato.html", "ir-para-nuvem.html"):
    assert "do início ao fim" in docs[ROOT / name].text(), name
home = docs[ROOT / "index.html"]
cards = [n for n in home.find("details") if n.attrs.get("class") == "service-card"]
assert [n.find("a")[0].attrs["href"] for n in cards] == [url for url, _ in expected]
assert len(cards) == 4
assert all("open" not in card.attrs and "name" not in card.attrs for card in cards)
assert all(len(card.find("summary")) == 1 for card in cards)
assert "Infraestrutura em nuvem," in home.find("h1")[0].text()
home_schema = json.loads(next(s.text() for s in home.find("script")
                              if s.attrs.get("type") == "application/ld+json"))
item_list = next(e for e in home_schema["@graph"] if e["@type"] == "ItemList")
assert [e["name"] for e in item_list["itemListElement"]] == [
    normalized(card.find("h3")[0].text()) for card in cards
]
contact = docs[ROOT / "contato.html"]
options = contact.find("select")[0].find("option")
assert len(options) == 5
assert [o.attrs.get("data-topic") for o in options[1:]] == [
    "nuvem", "gestao", "microsoft-365", "backup"
]
assert all(o.attrs.get("value") == normalized(o.text()) for o in options[1:])
assert "MOSP" in docs[ROOT / "migracao-azure.html"].text()
assert not (ROOT / "ciberseguranca-edr-xdr.html").exists()
json.loads((ROOT / "site.webmanifest").read_text(encoding="utf-8"))
urls = [n.text for n in ET.parse(ROOT / "sitemap.xml").findall(
    "{http://www.sitemaps.org/schemas/sitemap/0.9}url/"
    "{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
assert len(urls) == 11, urls
titles = set()
descriptions = set()
for url in urls:
    route = urlsplit(url).path
    expected_path = ROOT / ("index.html" if route == "/" else route.lstrip("/") + ".html")
    if BASE:
        response = urlopen(BASE + route, timeout=15)
        assert response.status == 200, route
        assert response.read().decode("utf-8").splitlines() == expected_path.read_text(encoding="utf-8").splitlines(), route
    doc = docs[expected_path]
    assert len(doc.find("title")) == 1 and len(doc.find("h1")) == 1, route
    title = normalized(doc.find("title")[0].text())
    metas = doc.find("meta")
    descriptions_for_page = [n.attrs["content"] for n in metas
                             if n.attrs.get("name") == "description"]
    assert len(descriptions_for_page) == 1, route
    description = descriptions_for_page[0]
    assert title and title not in titles, route
    assert description and description not in descriptions, route
    titles.add(title)
    descriptions.add(description)
    canonical = [n.attrs["href"] for n in doc.find("link")
                 if n.attrs.get("rel") == "canonical"]
    assert canonical == [url], route
    assert not any("noindex" in n.attrs.get("content", "")
                   for n in metas if n.attrs.get("name") == "robots"), route
    if route != "/privacidade":
        for key, value in (("og:title", title), ("og:description", description),
                           ("og:url", url), ("twitter:title", title),
                           ("twitter:description", description)):
            assert [n.attrs.get("content") for n in metas
                    if n.attrs.get("property", n.attrs.get("name")) == key] == [value], (route, key)
    for img in doc.find("img"):
        assert "alt" in img.attrs, route

missing = docs[ROOT / "404.html"]
assert any(n.attrs.get("name") == "robots" and "noindex" in n.attrs.get("content", "")
           for n in missing.find("meta"))
if BASE:
    try:
        urlopen(BASE + "/pagina-inexistente-validacao-seo", timeout=15)
        raise AssertionError("Missing route must respond 404")
    except HTTPError as error:
        assert error.code == 404
        assert Document(error.read().decode("utf-8")).root.find("title")[0].text() == missing.find("title")[0].text()
        assert "index, follow" not in error.headers.get("X-Robots-Tag", "")

topic_doc = contact
if BASE:
    topic_contact = urlopen(BASE + "/contato?assunto=nuvem", timeout=15)
    topic_doc = Document(topic_contact.read().decode("utf-8")).root
assert [n.attrs["href"] for n in topic_doc.find("link")
        if n.attrs.get("rel") == "canonical"] == ["https://cloud4tech.com.br/contato"]


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


opener = build_opener(NoRedirect())
redirects = (ROOT / "_redirects").read_text(encoding="utf-8").splitlines()
assert len(redirects) == 4
for line in redirects:
    source, target, status = line.split()
    assert int(status) == 301 and target == "/microsoft-365", source
    if BASE:
        try:
            opener.open(Request(BASE + source), timeout=15)
            raise AssertionError(f"No redirect: {source}")
        except HTTPError as error:
            assert error.code == int(status), (source, error.code)
            assert error.headers["Location"] == target, source

print(f"PASS: {len(docs)} HTML documents, {schemas} JSON-LD blocks, {faqs} FAQ/schema pairs, "
      f"{links} local links/assets, 11 sitemap routes and 4 redirect definitions.")
print(f"PASS SEO: {len(titles)} unique titles/descriptions/canonicals/H1s, social metadata parity, "
      "404/noindex, image alt attributes and contact canonical.")
print("HTTP preview checks passed." if BASE else "Offline checks only; HTTP responses were not tested.")
