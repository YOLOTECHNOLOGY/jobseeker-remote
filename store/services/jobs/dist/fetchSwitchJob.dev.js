"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSwitchJobService = void 0;

var _configuredAxios = _interopRequireDefault(require("helpers/configuredAxios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fetchSwitchJobService = function fetchSwitchJobService(payload) {
  var axios = (0, _configuredAxios["default"])('jobApplication', payload.status, false, payload.serverAccessToken);
  return axios.put("/".concat(payload.applicationId, "/jobseekers/switch-job"), {
    job_id: payload.job_id,
    source: 'web',
    device: 'web'
  });
};

exports.fetchSwitchJobService = fetchSwitchJobService;