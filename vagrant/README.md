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
