package com.avalonconsult.search.model;



public class Article{

    // JestId is optional, use when you want to set a property as ElasticSearch index id

   
    private String author;
    private String content;



    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
