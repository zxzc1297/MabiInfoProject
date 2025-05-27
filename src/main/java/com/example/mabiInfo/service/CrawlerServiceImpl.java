package com.example.mabiInfo.service;

import com.example.mabiInfo.model.Notice;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CrawlerServiceImpl {
    List<Notice> getNewsList() throws IOException;
}
