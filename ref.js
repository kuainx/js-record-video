!
  function () {
    function e(e) {
      var r = e,
        t = null,
        o = "audio/webm";
      void 0 !== window.InstallTrigger && (o = "audio/ogg");
      var a = null,
        s = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0,
        n = !!window.chrome && !s,
        i = void 0 !== window.InstallTrigger,
        c = !1,
        d = null,
        u = this;
      this.start = function (e) {
        if (c) return !0;
        c = !0;
        var s = window.MediaStream;
        if (void 0 === s && "undefined" != typeof webkitMediaStream && (s = webkitMediaStream), void 0 === s || !s) return console.error("_MediaStream === 'undefined'"),
          !1;
        if (r.getAudioTracks().length <= 0) return console.error("_user_media_stream.getAudioTracks().length <= 0"),
          !1;
        navigator.mozGetUserMedia ? (t = new s).addTrack(r.getAudioTracks()[0]) : t = new s(r.getAudioTracks());
        var l = {
          mimeType: o
        }; (function () {
          if (i) return !0;
          if (!n) return !1;
          var e = -1,
            r = navigator.userAgent;
          console.log(r),
            -1 !== (e = r.indexOf("Chrome")) && (r = r.substring(e + 7)),
            -1 !== (e = r.indexOf(";")) && (r = r.substring(0, e)),
            -1 !== (e = r.indexOf(" ")) && (r = r.substring(0, e));
          var t = parseInt("" + r, 10);
          return isNaN(t) && (t = parseInt(navigator.appVersion, 10)),
            console.log(t),
            t >= 49
        })() || (l = "video/vp8");
        try {
          a = new MediaRecorder(t, l)
        } catch (e) {
          a = new MediaRecorder(t)
        }
        if (!a || "canRecordMimeType" in a && !1 === a.canRecordMimeType(o)) return console.warn("MediaRecorder API seems unable to record mimeType:", o),
          !1;
        a.ondataavailable = function (e) {
          if (c) {
            var r = {
              status: 0,
              data: new Blob([e.data], {
                type: o
              })
            }; (!e.data || !e.data.size || e.data.size < 26800) && (r = {
              status: -1,
              data: "Your Browser Can Not Record Audio"
            }),
              u.ondataavailable(r)
          } else console.log("MediaRecorderWrapper record have stopped.")
        },
          a.onerror = function (e) {
            console.error(e.name),
              u.ondataavailable({
                status: -1,
                data: "Your Browser Can Not Record Audio"
              }),
              a && a.stop()
          };
        try {
          a.start()
        } catch (e) {
          return console.error(e),
            !1
        }
        return d = setInterval(function () {
          c && a && "recording" === a.state && a.requestData()
        },
          e),
          !0
      },
        this.stop = function () {
          if (console.log("MediaRecorderWrapper stop"), c && (c = !1, d && (clearInterval(d), d = null), a && "recording" === a.state)) {
            a.stop();
            try {
              r.getAudioTracks()[0].stop()
            } catch (e) {
              console.error(e)
            }
          }
        },
        this.ondataavailable = function (e) {
          console.log("recorded-blob", e)
        }
    }
    var r = function () {
      var r, t, o, a;
      this._server_url = "https://extension.doreso.com/v1/aha-music/identify",
        this._params = {},
        this._audio_recorder = (r = !1, t = null, {
          start: function (o) {
            console.log("AudioRecorder start"),
              r ? console.log("_is_recording=" + r) : (r = !0, chrome.tabCapture.capture({
                audio: !0,
                video: !1
              },
                function (r) {
                  try {
                    var a = new (window.AudioContext || window.webkitAudioContext);
                    console.log(r);
                    var s = a.createMediaStreamSource(r);
                    console.log(s),
                      s.connect(a.destination),
                      (t = new e(r)).ondataavailable = function (e) {
                        o.record_callback(e)
                      },
                      t.start(8e3) || o.record_callback({
                        status: -1,
                        data: "Your Browser Can Not Record Audio"
                      })
                  } catch (e) {
                    console.log(e),
                      o.record_callback({
                        status: -1,
                        data: "Your Browser Can Not Record Audio, Please Try the Old Version Chrome, This May Be The Chrome Bug."
                      })
                  }
                }))
          },
          stop: function () {
            console.log("AudioRecorder stop"),
              null != t && t.stop(),
              r = !1
          },
          is_recording: function () {
            return r
          }
        }),
        this._storage_helper = (o = [], a = "", chrome.runtime.onInstalled.addListener(function (e) {
          chrome.storage.sync.get("history_datas",
            function (e) {
              var r = e.history_datas;
              r && r.length > 0 && chrome.storage.local.set({
                history_datas: r
              }),
                chrome.storage.sync.set({
                  history_datas: []
                })
            })
        }), chrome.storage.local.get("history_datas",
          function (e) {
            (o = e.history_datas) || (o = [])
          }), chrome.storage.sync.get("device_id",
            function (e) {
              var r = e.device_id;
              r ? a = r : (a = Math.random() + "" + (new Date).getTime(), chrome.storage.sync.set({
                device_id: a
              },
                function () {
                  console.log("storage set")
                }))
            }), {
          get: function () {
            return o
          },
          set: function (e) {
            o.unshift(e),
              chrome.storage.local.set({
                history_datas: o
              },
                function () {
                  console.log(chrome.runtime.lastError)
                })
          },
          clear: function () {
            chrome.storage.local.set({
              history_datas: []
            },
              function () {
                o = []
              })
          },
          get_device_id: function () {
            return a
          }
        }),
        this._is_recognizing = !1;
      var s = this;
      function n(e, r) {
        var t = chrome.i18n.getUILanguage();
        t || (t = navigator.language);
        var o = this._server_url,
          a = navigator.userAgent,
          i = this._storage_helper.get_device_id(),
          c = new FormData;
        for (var d in s._params) c.append(d, s._params[d]);
        var u = chrome.runtime.getManifest(),
          l = chrome.runtime.id;
        console.log(l),
          c.append("token", r),
          c.append("sample_bytes", e.size),
          c.append("sample", e),
          c.append("timestamp", (new Date).getTime()),
          c.append("local_lan", t),
          c.append("browser_version", a),
          c.append("device_id", i),
          c.append("version", u.version),
          c.append("app_id", l),
          $.ajax({
            type: "POST",
            url: o,
            data: c,
            timeout: 15e3,
            dataType: "json",
            processData: !1,
            contentType: !1,
            success: function (r) {
              if (console.log(r), 0 == r.status) {
                var t = r.data[0];
                t.timestamp = (new Date).getTime(),
                  t.tab_url = s._params.tab_url,
                  chrome.runtime.sendMessage({
                    cmd: "popup_parse_result",
                    result: {
                      status: 0,
                      msg: "",
                      data: t
                    }
                  }),
                  s._storage_helper.set(t),
                  s.reload()
              } else - 2 == r.status ?
                function (e) {
                  chrome.identity.getAuthToken({
                    interactive: !0
                  },
                    function (r) {
                      chrome.runtime.lastError ? (console.log(chrome.runtime.lastError.message), chrome.runtime.sendMessage({
                        cmd: "popup_login"
                      })) : n(e, r)
                    })
                }(e) : -3 == r.status ? chrome.runtime.sendMessage({
                  cmd: "popup_update_version",
                  result: {
                    status: -1,
                    msg: r.msg
                  }
                }) : chrome.runtime.sendMessage({
                  cmd: "popup_error",
                  result: {
                    status: -1,
                    msg: r.msg
                  }
                })
            },
            error: function (e, r) {
              console.log(e);
              var t = "Your Network is Unavailable (Code = " + e.status + ")";
              chrome.runtime.sendMessage({
                cmd: "popup_error_http",
                result: {
                  status: e.status,
                  msg: t
                }
              })
            }
          })
      }
      return this.record_callback = function (e) {
        s.stop(),
          0 == e.status ? n(e.data, "no_login") : chrome.runtime.sendMessage({
            cmd: "popup_error",
            result: {
              status: -1,
              msg: e.data
            }
          })
      },
        this.start = function (e) {
          s._is_recognizing || (s._is_recognizing = !0, e && (s._params = e), _audio_recorder.start(s))
        },
        this.stop = function () {
          s._is_recognizing && (s._audio_recorder && s._audio_recorder.stop(), s._is_recognizing = !1)
        },
        this.reload = function () {
          chrome.runtime.sendMessage({
            cmd: "popup_reload",
            result: {
              status: 0,
              msg: "",
              recognize_status: s._is_recognizing,
              data: s._storage_helper.get()
            }
          })
        },
        this.init = function () {
          chrome.runtime.sendMessage({
            cmd: "popup_init",
            result: {
              status: 0,
              msg: "",
              recognize_status: s._is_recognizing,
              data: s._storage_helper.get()
            }
          })
        },
        this.clear_history = function () {
          s._storage_helper.clear(),
            chrome.runtime.sendMessage({
              cmd: "popup_reload",
              result: {
                status: 0,
                msg: "",
                recognize_status: s._is_recognizing,
                data: []
              }
            })
        },
        this.export_history = function () {
          chrome.runtime.sendMessage({
            cmd: "popup_export",
            result: {
              status: 0,
              msg: "",
              recognize_status: s._is_recognizing,
              data: s._storage_helper.get()
            }
          })
        },
        s
    }();
    chrome.windows.onRemoved.addListener(function (e) {
      chrome.notifications.clear("clear_history")
    }),
      chrome.runtime.onMessage.addListener(function (e, t, o) {
        switch (e.cmd) {
          case "background_start":
            chrome.tabs.query({
              active:
                !0,
              currentWindow: !0
            },
              function (e) {
                if (e.length < 1) return console.error("no select tab"),
                  void chrome.runtime.sendMessage({
                    cmd: "popup_error",
                    result: {
                      status: -1,
                      msg: "Please Select One Tab."
                    }
                  });
                var t = e[0],
                  o = t.url,
                  a = t.title;
                t.audible ? chrome.identity.getProfileUserInfo(function (e) {
                  var t = "",
                    s = "";
                  chrome.runtime.lastError ? console.log(chrome.runtime.lastError.message) : (t = e.email, s = e.id),
                    r.start({
                      tab_url: o,
                      email: t,
                      google_id: s,
                      tab_title: a
                    })
                }) : chrome.runtime.sendMessage({
                  cmd: "popup_error",
                  result: {
                    status: -1,
                    msg: "No Sound Playing in Current Tab"
                  }
                })
              });
            break;
          case "background_cancel":
            r && r.stop();
            break;
          case "background_reload":
            r && r.reload();
            break;
          case "background_init":
            r && r.init();
            break;
          case "background_export_history":
            console.log("background_export_history"),
              r && r.export_history();
            break;
          case "background_clear_history":
            console.log("background_clear_history"),
              r && r.clear_history()
        }
      })
  }();