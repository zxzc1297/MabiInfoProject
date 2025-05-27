package com.example.mabiInfo.service;

import com.example.mabiInfo.model.Notice;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class CrawlerService implements CrawlerServiceImpl{

    public List<Notice> getNewsList() throws IOException {
        String noticeUrl = "https://mabinogimobile.nexon.com/News/Notice";
        List<Notice> noticeList = new ArrayList<>();

        Document doc = Jsoup.connect(noticeUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36") // User-Agent 설정
                .timeout(5000) // 5초 타임아웃
                .get();

        Elements noticeElements = doc.select("div.list_area ul.list li.item");
//        System.out.println("noticeElements = " + noticeElements.toString());

        for(Element noticeElement : noticeElements){
            Notice tmpData = new Notice();

            Element titleSpan = noticeElement.selectFirst("a.title > span");
            Element dateSpan = noticeElement.selectFirst("div.date > span");

            String title = (titleSpan != null) ? titleSpan.text() : "제목 없음";
            String link = noticeUrl + "/" + noticeElement.attr("data-threadid");
            String date = (dateSpan != null) ? dateSpan.text() : "날짜 없음";

            tmpData.setTitle(title);
            tmpData.setLink(link);
            tmpData.setDate(date);

            noticeList.add(tmpData);
        }

        System.out.println("noticeList.toString() = " + noticeList.toString());

        return noticeList;
    }
}
