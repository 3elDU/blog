---
layout: about.njk
---

# About me

Welcome to my blog!

My name is Zakhar or petafloppa, I am a full stack developer, occasionally jumping into other fields. When I feel motivation to do so, I write about my findings here.

You may also like to check other places of mine:

- [My web-site](https://petafloppa.cc)
- [GitHub](https://github.com/3elDU)

# Self hosted

Currently, I do not self-host as much as I've wanted to. It's mostly private services for myself.<br>
I wish to populate this section in the future.

# Latest articles

{% from "article-card.njk" import articleCard %}
{% for article in collections.post %}
{{ articleCard(article.url, article.data.title, article.date) }}
{% endfor %}
