package com.avalonconsult.search.service;

import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.logging.ESLogger;
import org.elasticsearch.common.logging.Loggers;
import org.elasticsearch.common.text.Text;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.highlight.HighlightField;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.avalonconsult.search.data.SearchResult;
import com.avalonconsult.search.model.Hit;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.elasticsearch.index.query.QueryBuilders.matchAllQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryString;

@Component
public class SearchService {

	@Autowired
	protected Client esClient;

	private ESLogger logger = Loggers.getLogger(getClass().getName());
	
	public SearchResult google(String search, int first, int pageSize) {

		long totalHits = -1;
		long took = -1;

		SearchResult searchResult = null;

		QueryBuilder qb;
		if (search == null || search.trim().length() <= 0) {
			qb = matchAllQuery();
		} else {
			qb = queryString(search);
		}

		String[] INDEX_NAME = {"articles"};
		String[] INDEX_TYPE = {"article"};
		/* ClusterHealthResponse actionGet = esClient.admin().cluster()
				 .health(Requests.clusterHealthRequest(INDEX_NAME).waitForYellowStatus().waitForEvents(Priority.LANGUID).waitForRelocatingShards(0)).actionGet();
*/
		org.elasticsearch.action.search.SearchResponse searchHits = esClient
				.prepareSearch()
                .setIndices(INDEX_NAME)
                .setTypes(INDEX_TYPE)
                .setSearchType(SearchType.DFS_QUERY_THEN_FETCH).setQuery(qb)
				.setFrom(first).setSize(pageSize)
				.addHighlightedField("content")
				.setHighlighterPreTags("<span class='badge badge-info'>")
				.setHighlighterPostTags("</span>")
                .addFields("*", "_source")
                .execute().actionGet();

		totalHits = searchHits.getHits().totalHits();
		took = searchHits.getTookInMillis();

		List<Hit> hits = new ArrayList();
		for (SearchHit searchHit : searchHits.getHits()) {
			Hit hit = new Hit();

			hit.setIndex(searchHit.getIndex());
			hit.setType(searchHit.getType());
			hit.setId(searchHit.getId());
			hit.setSource(searchHit.getSourceAsString());
			
			
            if (searchHit.getFields() != null) {
				
            	/*if (logger.isDebugEnabled())
        			logger.debug("/google: author", searchHit.getFields().get("author") );
            	
            	if (logger.isDebugEnabled())
        			logger.debug("/google: content", searchHit.getFields().get("content") );
            	*/
            	
				
            }

            if (searchHit.getSource() != null) {
            	//hit.setSource(searchHit.getSource().toString());
            	
			 Map<String, Object> sourceMap = searchHit.sourceAsMap();
				
				
    			/*if (sourceMap.get("author") != null) {
					hit.setAuthor((String) sourceMap.get("author"));
				}*/
				
				if (sourceMap.get("content") != null) {
					hit.setSource((String) sourceMap.get("content") );
				}
            }


            if (searchHit.getHighlightFields() != null) {
                for (HighlightField highlightField : searchHit.getHighlightFields().values()) {
                    Text[] fragmentsBuilder = highlightField.getFragments();
                    for (Text fragment : fragmentsBuilder) {
                        hit.getHighlights().add(fragment.string());
                    }
                }
            }

			hits.add(hit);
		}

		searchResult = new SearchResult(took, totalHits, hits);


		return searchResult;

	}

}
