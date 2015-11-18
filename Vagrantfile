# -*- mode: ruby -*-
# # vi: set ft=ruby :

ANSIBLE_PLAYBOOK = ENV['ANSIBLE_PLAYBOOK'] || "vagrant/provisioning/site.yml"
VAGRANTFILE_API_VERSION = 2
BOX_NAME = ENV['BOX_NAME'] || "bento/centos-6.7"

machines = [
  {:name => "elasticsearch", :ip => "192.168.56.42", :memory => 1024, :groups => ["elastic"]},
  {:name => "couchbase", :ip => "192.168.56.41", :memory => 1024, :groups => ["couchbase"]},
#  {:name => "hdp", :ip => "192.168.56.43", :memory => 4096, :groups => ["hdp"]},
  {:name => "node", :ip => "192.168.56.44", :memory => 1024, :groups => ["nodejs"]}
]

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.ssh.insert_key = false

  if Vagrant.has_plugin?("vagrant-hostmanager")
    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
    config.hostmanager.ignore_private_ip = false
    config.hostmanager.include_offline = true
  end

  if Vagrant.has_plugin?("vagrant-cachier")
    # Configure cached packages to be shared between instances of the same base box.
    # More info on http://fgrehm.viewdocs.io/vagrant-cachier/usage
    config.cache.scope = :machine
    config.cache.synced_folder_opts = {
      type: :nfs,
      # The nolock option can be useful for an NFSv3 client that wants to avoid the
      # NLM sideband protocol. Without this option, apt-get might hang if it tries
      # to lock files needed for /var/cache/* operations. All of this can be avoided
      # by using NFSv4 everywhere. Please note that the tcp option is not the default.
      mount_options: ['rw', 'vers=3', 'tcp', 'nolock']
    }
    # For more information please check http://docs.vagrantup.com/v2/synced-folders/basic_usage.html
  end

  config.vm.synced_folder "./vagrant", "/vagrant", type: "nfs"

  domain_suffix = "demo"
  machines.each do |machine|
    short_name = machine[:name]
    domain_name = "#{short_name}.#{domain_suffix}"

    config.vm.define short_name do |vmconfig|
      vmconfig.vm.box = BOX_NAME
      vmconfig.vm.provider "virtualbox" do |v|
        v.name = short_name
        v.memory = machine[:memory]
        v.cpus = `#{RbConfig::CONFIG['host_os'] =~ /darwin/ ? 'sysctl -n hw.ncpu' : 'nproc'}`.chomp
      end

      vmconfig.vm.hostname = domain_name
      vmconfig.vm.network :private_network, ip: machine[:ip]

      vmconfig.vm.provision "ansible" do |ansible|
        ansible.playbook = ANSIBLE_PLAYBOOK

        ansible.groups = group_up(machines)
      end
    end
  end
end

# Method to define Ansible machine groupings
# @param machines - an array of mappings with at least the fields :name and
#                  :groups, where :name is a string and :groups is an array
# @return Returns a mapping of groups to names.
#
# Example:
# machines = [
# {:name => "nodejs", :groups => ["webserver", "frontend"]},
# {:name => "ambari", :groups => ["hadoop", "frontend"]},
# {:name => "slave", :groups => ["hadoop", "backend"]}]
#
# group_up(machines)
# {"webserver"=>["nodejs"],
# "frontend"=>["nodejs", "ambari"],
# "hadoop"=>["ambari", "slave"],
# "backend"=>["slave"],
# "all_groups:children"=>["webserver", "frontend", "hadoop", "backend"]}
def group_up (machines)
  group_map = Hash.new
  machines.each do |machine|
    name = machine[:name]
    machine[:groups].each do |group|
      if !group_map.has_key?(group)
        group_map[group] = Array.new
      end
      group_list = group_map[group]
      if !group_list.include?(name)
        group_list.push(name)
      end
    end
  end
  all_groups = Array.new
  group_map.each do |k, v|
     all_groups.push(k)
  end
  group_map["all_groups:children"] = all_groups

  return group_map
end
