package com.example.mabiInfo.service;

import com.example.mabiInfo.model.News;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class CrawlerService implements CrawlerServiceImpl{

    public List<News> getNewsList(String type) throws IOException {
        String noticeUrl = "https://mabinogimobile.nexon.com/News/" + type;
        List<News> newsList = new ArrayList<>();

        Document doc = Jsoup.connect(noticeUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36") // User-Agent 설정
                .timeout(5000) // 5초 타임아웃
                .get();

        Elements newsElements = doc.select("div.list_area ul.list li.item");
        int idx = 0;
        for(Element newsElement : newsElements){
            if(idx >= 5) break;
            News tmpData = new News();

            Element titleSpan = newsElement.selectFirst("a.title > span");
            Element dateSpan = newsElement.selectFirst("div.date > span");

            String title = (titleSpan != null) ? titleSpan.text() : "제목 없음";
            String link = noticeUrl + "/" + newsElement.attr("data-threadid");
            String date = (dateSpan != null) ? dateSpan.text() : "날짜 없음";

            tmpData.setTitle(title);
            tmpData.setLink(link);
            tmpData.setDate(date);

            newsList.add(tmpData);
            idx++;
        }

        return newsList;
    }
}
