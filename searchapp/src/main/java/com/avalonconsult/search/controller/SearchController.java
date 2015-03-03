package com.avalonconsult.search.controller;

import com.avalonconsult.search.data.SearchResponse;
import com.avalonconsult.search.data.SearchQuery;
import com.avalonconsult.search.data.SearchResult;
import com.avalonconsult.search.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("1/search")
public class SearchController {

    @Autowired
    SearchService searchService;


	/**
	 * Search for documents
	 * @param query
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody
	SearchResponse term(@RequestBody SearchQuery query) {
		SearchResult results = null;
		try {
			results = searchService.google(query.getSearch(), query.getFirst(), query.getPageSize());
		} catch (Exception e) {
			return new SearchResponse(new Exception(e));
		}
		
		SearchResponse response = new SearchResponse(results);
		return response;
	}

	
}

