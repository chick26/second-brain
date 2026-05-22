class main {
  constructor() {
    this.dv = app.plugins.plugins.dataview.api
    this.tp = app.plugins.plugins['templater-obsidian'].templater.current_functions_object
  }

  pin_me () {
    app.commands.executeCommandById("workspace:toggle-pin");
    return "";
  }
}
module.exports = main