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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
var lodash_es_1 = require("lodash-es");
var ramda_1 = require("ramda");
var index_module_scss_1 = require("./index.module.scss");
var classnames_1 = require("classnames");
var GroupedMultipleSelect = function (_a) {
    var _b, _c;
    var id = _a.id, label = _a.label, options = _a.options, className = _a.className, onSelect = _a.onSelect, style = _a.style, value = _a.value, labels = _a.labels, fieldRef = _a.fieldRef, error = _a.error, _d = _a.menuClassName, menuClassName = _d === void 0 ? '' : _d;
    var _e = react_1.useState(ramda_1.mergeLeft(value)(ramda_1.map(function () { return []; })(options))), selectedOptions = _e[0], setSelectedOptions = _e[1];
    var valueRef = react_1.useRef(value);
    react_1.useEffect(function () {
        setSelectedOptions(value);
    }, [value]);
    var _f = react_1.useState(false), open = _f[0], setOpen = _f[1];
    var handleChange = function (value, key) {
        var _a, _b;
        var _c, _d, _e;
        var formattedValue = value.toLowerCase();
        if (((_c = selectedOptions[key]) !== null && _c !== void 0 ? _c : []).includes(formattedValue)) {
            setSelectedOptions(__assign(__assign({}, selectedOptions), (_a = {}, _a[key] = ((_d = selectedOptions[key]) !== null && _d !== void 0 ? _d : []).filter(function (option) { return option !== formattedValue; }), _a)));
        }
        else {
            setSelectedOptions(__assign(__assign({}, selectedOptions), (_b = {}, _b[key] = __spreadArrays(((_e = selectedOptions[key]) !== null && _e !== void 0 ? _e : []), [formattedValue]), _b)));
        }
    };
    return (react_1["default"].createElement(FormControl_1["default"], { fullWidth: true, className: className, size: 'small' },
        react_1["default"].createElement(InputLabel_1["default"], { id: id + "-select-label" }, label),
        react_1["default"].createElement(Select_1["default"], __assign({}, fieldRef, { variant: 'filled', error: error, labelId: id + "-select-label", id: id, multiple: true, open: open, autoFocus: false, onOpen: function () { return setOpen(true); }, style: __assign(__assign({}, style), { background: ((_b = lodash_es_1.flatMap(ramda_1.values(selectedOptions), function (a) { return a || []; })) === null || _b === void 0 ? void 0 : _b.length) ? '#E7F1FB'
                    : '#F0F0F0' }), value: ((_c = lodash_es_1.flatMap(ramda_1.values(selectedOptions), function (a) { return a; })) === null || _c === void 0 ? void 0 : _c.length) ? lodash_es_1.flatMap(ramda_1.values(selectedOptions), function (a) { return a; })
                : [label], label: label, input: react_1["default"].createElement(OutlinedInput_1["default"], { label: 'Tag' }), renderValue: function () {
                var _a;
                var total = ramda_1.values(selectedOptions)
                    .filter(function (a) { return a; })
                    .reduce(function (num, arr) { return num + arr.length; }, 0);
                if (!((_a = lodash_es_1.flatMap(ramda_1.values(selectedOptions), function (a) { return a || []; })) === null || _a === void 0 ? void 0 : _a.length)) {
                    return (react_1["default"].createElement("div", { style: {
                            color: 'rgba(0, 0, 0, 0.6)',
                            position: 'relative',
                            // left: 13,
                            top: 2
                        } }, label));
                }
                else {
                    return (react_1["default"].createElement("div", { style: {
                            // color: 'rgba(0, 0, 0, 0.6)',
                            position: 'relative',
                            // left: 13,
                            top: 2
                        } }, label + " " + (total > 0 ? "(" + total + ")" : '')));
                }
            } }),
            react_1["default"].createElement(popContainer_1["default"], { name: label, multiple: true, onClose: function () {
                    setSelectedOptions(valueRef.current);
                    setOpen(false);
                }, onSave: function () {
                    onSelect(selectedOptions);
                    valueRef.current = selectedOptions;
                    setOpen(false);
                }, onReset: function () { return setSelectedOptions([]); } }, ramda_1.keys(options).map(function (key, index) {
                var _a;
                var value = options[key];
                return (react_1["default"].createElement("div", { key: key },
                    react_1["default"].createElement("div", { className: index_module_scss_1["default"].section }, (_a = labels[index]) !== null && _a !== void 0 ? _a : key),
                    value.map(function (option) {
                        var _a, _b, _c, _d;
                        return (react_1["default"].createElement(MenuItem_1["default"], { key: option.value, value: option.value, onClick: function () { return handleChange(option.value, key); } },
                            react_1["default"].createElement(ListItemText_1["default"], { className: classnames_1["default"]([index_module_scss_1["default"].item, index_module_scss_1["default"].lineCamp]), primary: option.label, style: {
                                    marginLeft: 30,
                                    color: ((_a = selectedOptions[key]) !== null && _a !== void 0 ? _a : []).indexOf((_b = option.value) === null || _b === void 0 ? void 0 : _b.toLowerCase()) > -1
                                        ? '#136FD3'
                                        : '#353535'
                                } }),
                            ((_c = selectedOptions[key]) !== null && _c !== void 0 ? _c : []).indexOf((_d = option.value) === null || _d === void 0 ? void 0 : _d.toLowerCase()) > -1 ? (react_1["default"].createElement("div", null,
                                react_1["default"].createElement("svg", { width: '19', height: '14', viewBox: '0 0 19 14', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
                                    react_1["default"].createElement("path", { d: 'M17.4545 2L7.14566 12L2 7', stroke: '#136FD3', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })))) : null));
                    })));
            })))));
};
exports["default"] = GroupedMultipleSelect;
