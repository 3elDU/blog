---
layout: about.njk
---

# Article list

{% from "article-card.njk" import articleCard %}
{% for article in collections.post %}
{{ articleCard(article.url, article.data.title, article.date) }}
{% endfor %}
