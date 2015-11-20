# Contributing
This demo is by no means complete! Contributing additions or fixes to the data pipeline or the search apps is welcome. Just be sure to follow these guidelines.

1. Fork project
2. Clone your fork of the project to your machine
3. Add this project as the upstream source

    ```sh
    git remote add upstream https://github.com/westeras/hdp-es-cb-demo
    ```
    
4. File an Issue to state your bug, or proposal for a new feature
5. Create a branch for your bug/feature

    ```sh
    git checkout -b [branch-name]
    ```

6. Code!
7. Commit and Push your local branch when your bug/feature is finished
8. Double check your diff, then file a Pull Request

## Commiting Guidelines
Help us make the commit history pretty by following this commit style guide.

* Prefix your commit with a tag in brackets. Some useful tags:
    * [elasticapp] - for changes to the elasticsearch-twitter-webapp
    * [stormapp] - for changes to the storm-search-app
    * [vagrant] - for changes to Vagrant artifacts
    * [docs] - for changes to .md files or other documentation
* Restrict line length to 80 characters or less. Here's how:
    * When commiting don't use the ```-m``` flag. Open the commit message in an editor and use multiline commits.
    * The first line of your commit should contain the prefix tag and a short description. Subsequent lines can contain a longer summary of the commit.
* Reference other issues and pull requests when applicable: ```Fixes #89```
* Do not push excessive numbers of commits. Squash commits together into concise blocks of changes.
