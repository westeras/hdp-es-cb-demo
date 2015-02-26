#!/usr/bin/env bash

set -x

# Clear yum cache
yum clean all

# Setup /etc/hosts with eth0 ip address and hostname
export ETH0IP=$(ip addr show eth0 | grep "inet " | awk '{ print $2 }' | cut -d'/' -f 1)
echo "$ETH0IP $(hostname) $(hostname -s)" >> /etc/hosts

# Disable SELINUX
sed -i 's/^SELINUX=.*/SELINUX=disabled/g' /etc/sysconfig/selinux
setenforce 0

# Turn off iptables
service iptables stop
chkconfig iptables off
 
# Turn down swapiness
sysctl vm.swappiness=10
echo "vm.swappiness=10" >> /etc/sysctl.conf
 
# Disable THP
echo never > /sys/kernel/mm/redhat_transparent_hugepage/defrag
echo never > /sys/kernel/mm/redhat_transparent_hugepage/enabled
echo "echo never > /sys/kernel/mm/redhat_transparent_hugepage/defrag" >> /etc/rc.local
echo "echo never > /sys/kernel/mm/redhat_transparent_hugepage/enabled" >> /etc/rc.local
 
# Enable more open files
echo "* - nofile 65536" >> /etc/security/limits.conf

# start ntp by default
service ntpd start
chkconfig ntpd on

# Setup passwordless ssh
ssh-keygen -t rsa -q -N '' -f /home/vagrant/.ssh/id_rsa
cat /home/vagrant/.ssh/id_rsa.pub >> /home/vagrant/.ssh/authorized_keys
chown -R vagrant:vagrant /home/vagrant/.ssh/
chmod 700 /home/vagrant/.ssh/
chmod 600 /home/vagrant/.ssh/authorized_keys

# Download Ambari repo file and install Ambari
wget -nv http://public-repo-1.hortonworks.com/ambari/centos6/1.x/updates/1.7.0/ambari.repo -O /etc/yum.repos.d/ambari.repo
yum -y install ambari-server

# Setup and start Ambari
sudo ambari-server setup -s

sleep 5
