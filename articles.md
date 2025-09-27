---
layout: about.njk
---

# Article list

{% from "article-card.njk" import articleCard %}
{% for article in collections.posts %}
{{ articleCard(article.url, article.data.title, article.date) }}
{% endfor %}
