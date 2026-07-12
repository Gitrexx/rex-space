---
title: 'Fine-tuning RoBERTa on 3.2M StockTwits Comments'
description: 'Turning millions of self-labeled StockTwits messages into an open-source RoBERTa sentiment model — and asking whether retail chatter predicts price.'
pubDate: '2022-04-02'
category: 'Research'
---

Retail investors never stop talking. On [StockTwits](https://stocktwits.com) — a social feed built around stock tickers — thousands of short messages land every hour, each one a small bet on where a name is headed. This post is about turning that noise into a signal: a [RoBERTa sentiment model](https://huggingface.co/zhayunduo/roberta-base-stocktwits-finetuned) fine-tuned on 3.2 million StockTwits comments, released open-source, and pointed at one question — does the crowd's mood say anything about price?

It started as a graduate project during my M.Tech at NUS. The [full pipeline is on GitHub](https://github.com/Gitrexx/PLPPM_Sentiment_Analysis_via_Stocktwits); the model and its usage live on the Hugging Face Hub.

## The gift of free labels

The hardest part of most sentiment projects is labeling. Someone has to read the text and decide what it means, and that someone is expensive.

StockTwits sidesteps this. When users post, they can tag the message themselves as **Bullish** or **Bearish**. That tag is a label — free, at scale, and written by the person who actually meant the sentiment. Scraping the StockTwits API across 2020–2022 gave a corpus of **3.2 million self-labeled comments**, which we published as a dataset on Kaggle alongside the model.

<div class="callout callout-note">
  <p>Self-labeling is a trade: you get millions of labels for nothing, but they are noisier than a curated set. People mislabel, joke, or tag the trade rather than the text. At this scale the noise mostly averages out — but it sets a ceiling on how clean the signal can ever be.</p>
</div>

The task reduces to binary classification:

| Label | Meaning              |
| ----- | -------------------- |
| `0`   | Bearish (price down) |
| `1`   | Bullish (price up)   |

## Cleaning the noise

Forum text is messy in specific, predictable ways: links, HTML escapes, cashtags like `$AAPL`, hashtags, `@mentions`, and a heavy dose of emoji doing real semantic work (🚀 is not decoration). Rather than strip all of that out, the preprocessing normalizes it into tokens the model can learn from:

```python
import re
import emoji

def process_text(texts):
    texts = re.sub(r'https?://\S+', "", texts)          # drop URLs
    texts = re.sub(r'www.\S+', "", texts)
    texts = texts.replace('&#39;', "'")                 # decode HTML entities
    texts = re.sub(r'(\#)(\S+)', r'hashtag_\2', texts)  # #move   -> hashtag_move
    texts = re.sub(r'(\$)([A-Za-z]+)', r'cashtag_\2', texts)  # $AAPL -> cashtag_AAPL
    texts = re.sub(r'(\@)(\S+)', r'mention_\2', texts)  # @user  -> mention_user
    texts = emoji.demojize(texts, delimiters=("", " ")) # 🚀 -> rocket
    return texts.strip()
```

The key move is **demojizing** instead of deleting. Turning 🚀 into `rocket` keeps the signal on the page, where RoBERTa's tokenizer can use it. Cashtags and mentions get a prefix so the model treats them as a class of thing rather than a thousand unique tokens.

## Fine-tuning

The base is `roberta-base` with a classification head, fine-tuned on the cleaned corpus. The settings were deliberately unfussy — the interesting variable here is data volume, not exotic hyperparameters:

- **Batch size:** 32
- **Learning rate:** 2e-5
- **Epochs:** 4

Validation accuracy climbed steadily and loss fell every epoch, with no sign of overfitting by epoch 4:

| Epoch | Train loss | Val loss | Val accuracy |
| ----- | ---------- | -------- | ------------ |
| 1     | 0.3495     | 0.2956   | 86.79%       |
| 2     | 0.2717     | 0.2235   | 90.21%       |
| 3     | 0.2360     | 0.1875   | 92.10%       |
| 4     | 0.2106     | 0.1603   | **93.43%**   |

**93.43%** validation accuracy on held-out StockTwits messages — a strong result for weakly-labeled social text, and a reminder that at millions of examples, plain fine-tuning goes a long way.

## Using the model

The model is public on the Hub, so inference is a few lines. Run each message through the same `process_text` above before classifying — the model expects normalized text:

```python
from transformers import RobertaForSequenceClassification, RobertaTokenizer, pipeline

tokenizer = RobertaTokenizer.from_pretrained('zhayunduo/roberta-base-stocktwits-finetuned')
model = RobertaForSequenceClassification.from_pretrained('zhayunduo/roberta-base-stocktwits-finetuned')

nlp = pipeline("text-classification", model=model, tokenizer=tokenizer)

sentences = ["to the moon 🚀🚀", "this is going to tank, get out now"]
sentences = [process_text(s) for s in sentences]

print(nlp(sentences))
# [{'label': 'LABEL_1', ...}, {'label': 'LABEL_0', ...}]  # bullish, bearish
```

`LABEL_1` is bullish, `LABEL_0` is bearish.

## Does the mood predict the price?

Accuracy on the sentiment task was never the real goal — it was the instrument. The project's actual question was whether aggregate sentiment carries predictive signal for price movement.

The rest of the pipeline scores every message for a ticker, aggregates into a **daily average sentiment**, and feeds that as a feature into a classifier for next-day movement. The honest finding: sentiment is a **weak, noisy feature**, not a crystal ball. It correlates with movement more than it predicts it — the crowd often gets loud *because* a stock already moved, not before. As one input among many it earns its place; on its own it is closer to a mirror than a forecast.

<div class="callout callout-warning">
  <p>This was a research project, not investment advice. Self-labeled data, a 2020–2022 window shaped by unusual market conditions, and reflexive crowd behavior all limit how far these results generalize. Don't trade on it.</p>
</div>

## Takeaways

- **Free labels change the economics.** Self-tagged data let a small team fine-tune on millions of examples without a labeling budget — the volume did the heavy lifting.
- **Normalize, don't delete.** Keeping emoji and structured tokens (cashtags, mentions) as text preserved signal a naive clean-up would have thrown away.
- **A good classifier is not a good predictor.** 93% sentiment accuracy did not translate into 93% market prediction. Knowing what the crowd feels is not the same as knowing what the price will do.

The model, dataset, and full training code are all open:

- **Model:** [zhayunduo/roberta-base-stocktwits-finetuned](https://huggingface.co/zhayunduo/roberta-base-stocktwits-finetuned)
- **Code:** [PLPPM_Sentiment_Analysis_via_Stocktwits](https://github.com/Gitrexx/PLPPM_Sentiment_Analysis_via_Stocktwits)
