package com.example.mabiInfo.service;

import com.example.mabiInfo.model.News;

import java.io.IOException;
import java.util.List;

public interface CrawlerServiceImpl {
    List<News> getNewsList(String type) throws IOException;
}
