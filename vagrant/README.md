This Vagrantfile will boot up a single node Couchbase environment and a single node Elasticsearch environment.

Prereqs:
--------

* Installed Virtualbox: https://www.virtualbox.org/wiki/Downloads
* Installed Vagrant: http://www.vagrantup.com/downloads.html
* Installed Vagrant Plugins

    ```sh
    vagrant plugin install vagrant-hostmanager
    vagrant plugin install vagrant-cachier
    ```

* Install Ansible

    ```sh
    brew install ansible
    ```

Getting Started
---------------

Simple run vagrant from this directory

```sh
vagrant up
```
This command will run the Vagrant script to boot up a Couchbase server and an Elasticsearch server. Some other useful Vagrant commands:

```sh
vagrant destroy 		# tear down of all machines
vagrant ssh [hostname]	# ssh into the given hostname (specified at the top of the Vagrantfile)
vagrant provision		# rerun the ansible provisioning steps on the running machines
```