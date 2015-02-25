# hdp-es-cb-demo

This project contains an integrated Twitter/Kafka/Storm workflow. To run:

Setup Project

1. fork project
2. clone your fork of the project to your machine
3. add this project as the upstream source

    ```sh
    git remote add upstream https://github.com/westeras/hdp-es-cb-demo
    ```
4. create a branch for yourself

    ```sh
    git branch [branch-name]
    git checkout [branch-name]
    ```

Setup Storm Topology

1. add a twitter4j.properties with consumer and api keys and secrets
2. open topology.properties and change values to match your system
3. cd into hdp-es-cb-demo, run 'mvn clean package'
4. create a Kafka topic matching your value for 'topic' in topology.properties

To run

1. copy target jar to cluster
2. for producer, run `java -cp storm-search-demo-1.0-SNAPSHOT.jar com.avalonconsult.TwitterProducer <query terms>`
3. for storm topology, run `storm jar storm-search-demo-1.0-SNAPSHOT.jar com.avalonconsult.TwitterIngestTopology`
