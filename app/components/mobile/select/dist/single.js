"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
/* eslint-disable react/no-unknown-property */
var react_1 = require("react");
var InputLabel_1 = require("@mui/material/InputLabel");
var MenuItem_1 = require("@mui/material/MenuItem");
var FormControl_1 = require("@mui/material/FormControl");
var ListItemText_1 = require("@mui/material/ListItemText");
var Select_1 = require("@mui/material/Select");
var OutlinedInput_1 = require("@mui/material/OutlinedInput");
var popContainer_1 = require("../popContainer");
var index_module_scss_1 = require("./index.module.scss");
var SingleSelect = function (_a) {
    var id = _a.id, label = _a.label, options = _a.options, className = _a.className, onSelect = _a.onSelect, value = _a.value, fieldRef = _a.fieldRef, error = _a.error, style = _a.style, _b = _a.menuClassName, menuClassName = _b === void 0 ? '' : _b;
    var _c = react_1.useState(false), open = _c[0], setOpen = _c[1];
    return (react_1["default"].createElement(FormControl_1["default"], { fullWidth: true, className: className, size: 'small' },
        react_1["default"].createElement(InputLabel_1["default"], { id: id + "-select-label" }, label),
        react_1["default"].createElement(Select_1["default"], __assign({}, fieldRef, { variant: 'filled', error: error, labelId: id + "-select-label", id: id, open: open, onOpen: function () { return setOpen(true); }, value: value, style: __assign(__assign({}, style), { background: (value === null || value === void 0 ? void 0 : value.length) ? '#E7F1FB' : '#F0F0F0' }), label: label, input: react_1["default"].createElement(OutlinedInput_1["default"], { label: 'Tag' }), renderValue: function (value) {
                var _a, _b;
                return react_1["default"].createElement(InputLabel_1["default"], { id: id + "-select-label", style: { color: options.find(function (option) { return option.value === value; }) ? '#136FD3' : undefined, overflow: 'hidden' } }, (_b = (_a = options.find(function (option) { return option.value === value; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : label);
            } }),
            react_1["default"].createElement(popContainer_1["default"], { name: label, onClose: function () { return setOpen(false); } }, options &&
                options.map(function (option) { return (react_1["default"].createElement(MenuItem_1["default"], { selected: value === option.value, key: option.value, value: option.value, onClick: function () {
                        onSelect(option.value);
                        setOpen(false);
                    } },
                    react_1["default"].createElement(ListItemText_1["default"], { primary: option.label, className: index_module_scss_1["default"].lineCamp, style: {
                            color: value === option.value ? '#136FD3' : undefined
                        } }),
                    value === option.value ?
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("svg", { width: "19", height: "14", viewBox: "0 0 19 14", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                                react_1["default"].createElement("path", { d: "M17.4545 2L7.14566 12L2 7", stroke: "#136FD3", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }))) : null)); })))));
};
exports["default"] = SingleSelect;
