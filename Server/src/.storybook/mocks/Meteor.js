// FIXME: we can't use ES6 imports in mocks, not sure why
module.exports = {
    settings: 
    {
      "public": {
        "DEPLOY_URL_BASE": "http://redball-server:3000/agent-binaries/",
        "install_config": {
            "Linux": {
                "install_dir": "/usr/local/Redball",
                "install_file_name": "redball",
                "binaries": {
                    "x86": "redball_x86.elf",
                    "x86_64": "redball_x64.elf"
                }
            },
            "MacOS": {
                "install_dir": "/usr/local/Redball",
                "install_file_name": "redball",
                "binaries": {
                    "x86": "redball_mac_x86",
                    "x86_64": "redball_mac_x64"
                }
            },
            "Windows": {
                "install_dir": "%APPDIR%\\Redball",
                "install_file_name": "redball.exe",
                "binaries": {
                    "x86": "redball_x86.exe",
                    "x86_64": "redball_x64.exe"
                }
            }
        }
      }
  },
    startup: () => { },
    _localStorage: window ? window.localStorage : { setItem: () => {}, getItem: () => {} },
    isClient: () => true,
    isServer: () => false,
    absoluteUrl: () => 'http://vulcanjs.org/'
}
