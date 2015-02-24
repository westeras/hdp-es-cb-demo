# hdp-es-cb-demo

This project contains an integrated Twitter/Kafka/Storm workflow. To run:

Setup
1. clone project
2. add a twitter4j.properties with consumer and api keys and secrets
3. open topology.properties and change values to match your system
4. cd into hdp-es-cb-demo, run 'mvn clean package'
5. create a Kafka topic matching your value for 'topic' in topology.properties

To run
1. copy target jar to cluster
2. for producer, run 'java -cp storm-search-demo-1.0-SNAPSHOT.jar com.avalonconsult.TwitterProducer <query terms>'
3. for storm topology, run 'storm jar storm-search-demo-1.0-SNAPSHOT.jar com.avalonconsult.TwitterIngestTopology'
