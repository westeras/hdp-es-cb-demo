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
   ```

4. Install Ansible

   ```sh
   # For Mac; for Windows see Ansible documentation
   brew install ansible
   ```

5. Spin up virtual machines

   ```sh
   cd hdp-es-cb-demo/
   vagrant up
   ```

After the last machine has been provisioned, you should be able to open http://hdp.demo:8080, log into Ambari with admin:admin and see that components are being installed (note the installation of HDP will take quite a while and requires a solid internet connection).

#### Useful Vagrant commands

```sh
vagrant destroy         # tear down of all machines
vagrant ssh [hostname]  # ssh into the given hostname (specified at the top of the Vagrantfile)
vagrant provision       # rerun the ansible provisioning steps on the running machines
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
   # on your local machine
   cd hdp-es-cb-demo/
   mvn clean package
   ```

2. Copy target jar into shared vagrant folder (the vagrant folder is a shared folder between your local machine and the VM):

   ```sh
   # on your local machine
   cp target/storm-search-demo-1.0-SNAPSHOT.jar vagrant/
   ```

2. Run Twitter producer:

   ```sh
   # on hdp.demo (use 'vagrant ssh hdp')
   java -cp /vagrant/storm-search-demo-1.0-SNAPSHOT.jar com.avalonconsult.TwitterProducer <query terms>
   ```
   Note: choose query terms that won't return a massive influx of tweets and overwhelm your vm

3. In a different terminal window, run the Storm topology:

   ```sh
   # also on hdp.demo
   storm jar /vagrant/storm-search-demo-1.0-SNAPSHOT.jar com.avalonconsult.TwitterIngestTopology
   ```

At this point, you should be able to see things happening in the Storm UI (http://hdp.demo:8744/).  Click on twitter-ingest-topology to see statistics and throughput.  Visit the Couchbase UI to see documents as they are inserted into the document store (http://couchbase.demo:8091/, couchbase:couchbase for user:pass).  Finally, you can query the Elasticsearch instance and view documents (http://elasticsearch.demo:9200/demo/couchbaseDocument/_search?pretty&q=*)

### To Run the Webapp

Open the webapp in the browser: go to http://node.demo:8000/app/
* Feel free to modify this webapp as needed.  It uses elasticui (http://www.elasticui.com/).  This app can be more sophisticated and as time permits more work will be added to it.
* Its an app that find the latest tweets elastic search gets and display them.  They will be displayed in date time order.  The UI refreshes every few seconds.  You can also search and see filters on user names (although the names are currently displayed after analysis).

## If you don't want to work with the Hadoop part

It is possible to bypass the Hadoop portion of the demo and load some sample data directly into Couchbase.  Note that a bulk import into Couchbase will still be mirrored over to Elasticsearch, so the data will be in both places.  Here are the steps to setup a clean Couchbase/Elasticsearch environment with no HDP node and sample data imported:

```sh
# bring up couchbase and elasticsearch nodes (if not up already)
vagrant up elasticsearch
vagrant up couchbase

# when couchbase.demo finishes loading
vagrant ssh couchbase -c "/opt/couchbase/bin/cbrestore /vagrant/files/sample_data/cb_backup/ http://localhost:8091 --bucket-source=demo --bucket-destination=demo"
```

The sample dataset in hdp-es-cb-demo/files/sample\_data/cb_backup contains roughly a thousand tweets dumped from a Couchbase instance that were ingested/processed using Storm.

Also, for those interested, this is what you would run if you wanted to back up your own Couchbase instance:
```sh
/opt/couchbase/bin/cbbackup http://localhost:8091 /home/vagrant/cb_backup -u couchbase -p couchbase -b demo
```
This command creates a backup of the demo bucket under /home/vagrant/cb_backup

## Running Kibana
Kibana should be started after provisioning the Elasticsearch node.  However, if for some reason Kibana isn't started, Elasticsearch must be running in order for Kibana to successfully start.  If you are having issues getting Kibana to run, you can either reprovision with:
```sh
# from hdp-es-cb-demo/ on host machine
vagrant provision elasticsearch
```
Otherwise, try the following steps to get Kibana running:
```sh
vagrant ssh elasticsearch
sudo service elasticsearch status

# If elasticsearch is running, you can start Kibana
sudo service kibana4 start

# Otherwise, start Elasticsearch, wait, then start Kibana
sudo service elasticsearch start
# wait until elasticsearch is up
sudo service kibana4 start
```

## Resetting Couchbase and Elasticsearch
It is nice to not have to rebuild the environment from scratch just to reset the data in Couchbase and Elasticsearch.

### Couchbase
Deletes the data bucket, removes the replication endpoint, recreates the data bucket, recreates the replication endpoint, recreates and starts the replication.

```bash
vagrant ssh couchbase
/vagrant/scripts/reset_couchbase.sh
```

### Elasticsearch
Deletes the index and recreates it.

```bash
vagrant ssh elasticsearch
/vagrant/scripts/reset_elasticsearch.sh
```

## Running Hive Analytics
The script hdp-es-cb-demo/scripts/create_table.q will place an external Hive table (called tweets) over the HDFS directory /tmp/tweets.  All you need to do is run the script.  The table will be created regardless of whether or not any data exists in the directory.
```sh
vagrant ssh hdp

# Run the script to create the Hive table
hive -f /vagrant/scripts/create_table.q

# Open the Hive CLI and start querying the table
hive

# Select the first 10 items from the tweets table
SELECT * FROM tweets LIMIT 10;
```

## Troubleshooting
### Vagrant fails while mounting shared folders
If you run ```vagrant up``` and get an error similar to:
```sh
==> elasticsearch: Mounting NFS shared folders...
The following SSH command responded with a non-zero exit status.
Vagrant assumes that this means the command failed!

mount -o 'vers=3,udp' 192.168.56.1:'/Users/kruthar/projects/elasticsearch/hdp-es-cb-demo' /vagrant

Stdout from the command:



Stderr from the command:

mount.nfs: access denied by server while mounting 192.168.56.1:/Users/kruthar/projects/elasticsearch/hdp-es-cb-demo
```
you may have some conflicting shared directory information stored in /etc/exports on your local machine. Remove any lines that pertain to this project and try again.
### Ambari fails to install components
Ambari is prone to failure during cluster initialization and installation of it's components. A lot of the time this is due to timeouts because of long package downloads or some other long running process. Due to the automatic nature of the setup process, there is not an easy way to restart/continue the install after it fails. The solution is to use the master-service-reinstall script. This script will use the Ambari REST service to read the configured components of the cluster, and reinstall them.

You can use the script by editing the configurations at the top of the script to match your HDP cluster (they are already configured for this demo's cluster). Then running the script like so:

```sh
./master-service-reinstall.sh
```
