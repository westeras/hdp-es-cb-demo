# hdp-es-cb-demo

This project contains a fully integrated Hadoop+Search demo provisioned by Vagrant

It automatically provisions three virtual machines running CentOS 6.6:
* one node hosting a Couchbase server
* one node hosting an Elasticsearch server
* a fully functional, one node Hadoop cluster running Hortonworks HDP 2.2

This demo illustrates a relatively common business use case: the use of Hadoop to stream data from Twitter as well as provide deep, reliable archive storage, in conjunction with a Couchbase instance to buffer tweets for ad hoc analysis, and an Elasticsearch instance to enable search.

## Getting the project
### If you are planning on contributing, do the following:

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

### Otherwise if you just want to run the demo:

1. clone project

   ```sh
   git clone https://github.com/westeras/hdp-es-cb-demo
   ```

## Setting up the Environment

1. Install Virtualbox (https://www.virtualbox.org/wiki/Downloads)
2. Install Vagrant (http://www.vagrantup.com/downloads.html)
3. Install Vagrant plugins:

   ```sh
   vagrant plugin install vagrant-hostmanager
   vagrant plugin install vagrant-cachier
   vagrant plugin install vagrant-vbguest
   ```
   
4. Install Ansible

   ```sh
   brew install ansible
   ```

5. Spin up virtual machines

   ```sh
   cd hdp-es-cb-demo/vagrant/
   vagrant up
   ```
   
## Running the demo

### Setup

1. add a twitter4j.properties to src/main/resources with consumer and api keys and secrets (see https://dev.twitter.com/ for help)
2. after HDP has fully installed, run the following to create a new Kafka topic (NOTE: ssh into the hdp node with 'vagrant ssh hdp.demo' first):

   ```sh
   cd /usr/hdp/current/kafka-broker/
   bin/kafka-topics.sh --create --zookeeper hdp.demo:2181 --replication-factor 1 --partitions 1 --topic twitter
   ```

### To run topology

1. Build project using Maven:

   ```sh
   cd hdp-es-cb-demo/
   mvn clean package
   ```

2. Copy target jar into shared vagrant folder:

   ```sh
   cp target/storm-search-demo-1.0-SNAPSHOT.jar vagrant/
   ```

2. Run Twitter producer:

   ```sh
   java -cp /vagrant/storm-search-demo-1.0-SNAPSHOT.jar com.avalonconsult.TwitterProducer <query terms>
   ```
   Note: choose query terms that won't return a massive influx of tweets and overwhelm your vm

3. In a different terminal window, run the Storm topology:

   ```sh
   storm jar /vagrant/storm-search-demo-1.0-SNAPSHOT.jar com.avalonconsult.TwitterIngestTopology
   ```

At this point, you should be able to see things happening in the Storm UI (http://hdp.demo:8744/).  Click on twitter-ingest-topology to see statistics and throughput.  Visit the Couchbase UI to see documents as they are inserted into the document store (http://couchbase.demo:8091/, couchbase:couchbase for user:pass).  Finally, you can query the Elasticsearch instance and view documents (http://elasticsearch.demo:9200/demo/couchbaseDocument/_search?pretty&q=*)

### To Run the Webapp

1. Install Nodejs
* You can see the download and instructions to install node here: https://nodejs.org/download/


2. Install the node-http-server package

   ```sh
   npm install node-http-server
   ```

3. Install all dependencies for the web

   ```sh
   cd elasticsearch-twitter-webapp
   npm install
   ```

4. Start the web (while in the elasticsearch-twitter-webapp folder)

   ```sh
   npm start
   ```

5. Open the webapp in the browser: go to http://localhost:8000/app/elasticuidemo.html
*Feel free to modify this webapp as needed.  It uses elasticui (http://www.elasticui.com/).  This app can be more sophisticated and as time permits more work will be added to it.
*Its an app that find the latest tweets elastic search gets and display them.  They will be displayed in date time order.  The UI refreshes every few seconds.  You can also search and see filters on user names (although the names are currently displayed after analysis).


## Troubleshooting
### Ambari fails to install components
Ambari is prone to failure during cluster initilization and installation of it's components. A lot of the time this is due to timeouts because of long package downloads or some other long running process. Due to the automatic nature of the setup process, there is not an easy way to restart/continue the install after it fails. The solution is to use the master-
