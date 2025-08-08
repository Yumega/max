// 先提取第一个H1标题
let h1Title = "";
const h1 = document.querySelector("h1");
if (h1) {
  h1Title = h1.innerText.trim().toUpperCase() + "\n\n";
}

// 定义优先提取正文的类名列表
const contentSelectors = [
  "div.article-body__content",
  "div.article__content-container",
  "div#maincontent", 
  "div.sdc-article-body.sdc-article-body--story.sdc-article-body--lead",
  "section[data-title='Content']",
  "div.article-body",
  "div.article-container",
  "article",
  "body"
];

// 查找正文元素
let mainContent = null;
for (let selector of contentSelectors) {
  const el = document.querySelector(selector);
  if (el) {
    mainContent = el;
    break;
  }
}
mainContent = mainContent || document.body;

// 克隆节点避免修改原始页面
const clone = mainContent.cloneNode(true);

// 移除无关内容
clone.querySelectorAll(`
#BBC
  div[data-testid="byline-new"],
  div[data-component="byline-block"],
  div[data-component="image-block"],
  div[data-component="caption-block"],
  div[data-component="links-block"],
  div[data-component="tags"],
#NBCnews
  div.summary-box[data-testid="summary-box"],
  figure.styles_inlineImage__FvnTh.styles_medium__MEKii,
  div.recommended-intersection-ref[data-testid="recommended-wrapper"],
  div.article-hero__media-holder.layout-grid-container,
  div.article-social-share-top[data-testid="article-body-social-share-menu"],
  div.article-inline-byline[data-testid="article-byline-inline"],
  div.styles_contentTimestampWithSource__FIhli[data-testid="article-body-timestamp"],
  div.expanded-byline-contributors.articleBylineContainer,
#CNN
  div[class^="ad-slot-dynamic"],
  div.ad-feedback-link__label,
  div.image__metadata,
  div.image__caption.attribution[itemprop="caption"],
  div[class*="media__metadata"],
  p[data-component-name="editor-note"],
  div.image__lede.article__lede-wrapper,
  metaCaption,
  image__metadata,
  div[data-component-name="related-content"],
  div.related-content,
  div.action-bar__action-sheet--action.action-bar--expanded,
#卫报
  div.dcr-ut4tvs,
  figcaption,
  gu-island,
  aside[aria-label="newsletter promotion"],
  p[class^="related-content"],
#SKYNEWS
  div[data-component-name="sdc-article-strapline"],
  div.sdc-article-strapline__link,
  div.sdc-article-related-stories__content,
  div.sdc-site-video,
  div.sdc-site-video *,
#CNA
  div.referenced-card,
  div.social-media,
  div.programtic-ads.sub_article,
  div.programtic-ads outstream_article,
  div.programtic-ads,
  div.newsletter-widget,
  form.newsletter-widget-subscription-form,
#FOXNEWS
  div.featured.featured-video.video-ct,
  div.article-meta,
  div.ad-container.mobile.ad-h-250.ad-w-300.ad-placeholder-load,
  div.caption,
  div#beyondwords-wrapper.beyondwords-wrapper,
  div.video-container,
  a[href="https://www.foxnews.com/apps-products"],
  a[href="https://www.foxnews.com/download"],
  a[href="https://www.foxbusiness.com/apps-products"],
#WSJ
  div[class*="AuthoringContainer"],
  div[aria-label="Utility Bar"][data-testid="utility-bar"],
  a.link-external[href^="mailto:"],
  div[aria-label="What to Read Next"],
  div[type="wtrn_cxense"],
  div.css-189jf7p,
#Yahoonews
  div.relative.flex,
  div.relative.w-full,
  div[class*="crossword"],
  div.mb-4.grow.border-y.border-solid.border-batcave.pb-6.pt-4
`).forEach(el => el.remove());

// 移除非可读元素
clone.querySelectorAll("script, style, noscript, iframe").forEach(el => el.remove());

// 清除标签，只保留结构性文本（标题、段落、换行、列表）
function extractTextWithStructure(node) {
  let text = "";

  if (/^H[1-6]$/.test(node.nodeName)) {
    text += "\n\n" + node.innerText.trim().toUpperCase() + "\n\n";
  } else if (node.nodeName === "P") {
    text += "\n" + node.innerText.trim() + "\n";
  } else if (node.nodeName === "LI") {
    text += "- " + node.innerText.trim() + "\n";
  } else if (node.nodeName === "PRE" || node.nodeName === "CODE") {
    text += "\n```\n" + node.innerText.trim() + "\n```\n";
  } else if (node.nodeName === "BR") {
    text += "\n";
  } else if (node.childNodes && node.childNodes.length) {
    for (let child of node.childNodes) {
      text += extractTextWithStructure(child);
    }
  } else if (node.nodeType === Node.TEXT_NODE) {
    const trimmed = node.textContent.trim();
    if (trimmed) {
      text += trimmed + " ";
    }
  }

  return text;
}

// 提取结构化正文纯文本
const bodyText = extractTextWithStructure(clone)
  .replace(/\n{3,}/g, "\n\n")
  .trim();

// 合并标题和正文
const finalText = (h1Title + bodyText).trim();

// 调用 AI 或输出
completion(finalText);
