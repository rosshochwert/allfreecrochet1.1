# For an explanation of the steroids.config properties, see the guide at
# http://guides.appgyver.com/steroids/guides/project_configuration/config-application-coffee/

steroids.config.name = "AllFreeCrochet1.1"

# -- Initial Location --
steroids.config.location = "index.html"

# -- Tab Bar --
steroids.config.tabBar.enabled = true
steroids.config.tabBar.tabs = [
  {
    title: "Articles"
    icon: "icons/articles@2x.png"
    location: "http://localhost/views/article/index.html"
  },
  {
    title: "Subscribe"
    icon: "icons/subscribe@2x.png"
    location: "http://www.allfreecrochet.com/section/subctr/action/signup"
  }
]

steroids.config.tabBar.tintColor = "#ffffff"
# steroids.config.tabBar.tabTitleColor = "#00aeef"
# steroids.config.tabBar.selectedTabTintColor = "#ffffff"
# steroids.config.tabBar.selectedTabBackgroundImage = "icons/pill@2x.png"

# steroids.config.tabBar.backgroundImage = ""

# -- Navigation Bar --
steroids.config.navigationBar.tintColor = "#437eb0"
steroids.config.navigationBar.titleColor = "#ffffff"
steroids.config.navigationBar.buttonTintColor = "#ffffff"
steroids.config.navigationBar.buttonTitleColor = "#ffffff"

# steroids.config.navigationBar.landscape.backgroundImage = "icons/HeaderExample@2x.png"
# steroids.config.navigationBar.portrait.backgroundImage = "icons/HeaderExample@2x.png"

# -- Android Loading Screen
steroids.config.loadingScreen.tintColor = "#262626"

# -- iOS Status Bar --
steroids.config.statusBar.enabled = true
steroids.config.statusBar.style = "default"

# -- File Watcher --
# steroids.config.watch.exclude = ["www/my_excluded_file.js", "www/my_excluded_dir"]

# -- Pre- and Post-Make hooks --
# steroids.config.hooks.preMake.cmd = "echo"
# steroids.config.hooks.preMake.args = ["running yeoman"]
# steroids.config.hooks.postMake.cmd = "echo"
# steroids.config.hooks.postMake.args = ["cleaning up files"]

# -- Default Editor --
# steroids.config.editor.cmd = "subl"
# steroids.config.editor.args = ["."]
