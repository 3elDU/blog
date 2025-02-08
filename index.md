---
layout: about.njk
---

# About me

Welcome to my blog!

My name is Zakhar or petafloppa, I am a full stack developer, occasionally jumping into other fields. When I feel motivation to do so, I write about my findings here.

You may also like to check other places of mine:

- [My web-site](https://petafloppa.cc)
- [GitHub](https://petafloppa.cc)
- [Forgejo (self-hosted)](https://git.petafloppa.cc)

# Latest articles

{% from "article-card.njk" import articleCard %}
{% for article in collections.post %}
{{ articleCard(article.url, article.data.title, article.date) }}
{% endfor %}
