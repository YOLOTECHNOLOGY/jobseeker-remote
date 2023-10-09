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
var MultipleSelect = function (_a) {
    var id = _a.id, label = _a.label, options = _a.options, className = _a.className, onSelect = _a.onSelect, style = _a.style, value = _a.value, fieldRef = _a.fieldRef, error = _a.error, _b = _a.menuClassName, menuClassName = _b === void 0 ? '' : _b;
    var _c = react_1.useState(value || []), selectedOptions = _c[0], setSelectedOptions = _c[1];
    react_1.useEffect(function () {
        setSelectedOptions(value);
    }, [value]);
    var valueRef = react_1.useRef(value);
    var _d = react_1.useState(false), open = _d[0], setOpen = _d[1];
    var handleChange = function (value) {
        var formattedValue = value.toLowerCase();
        if (selectedOptions.includes(formattedValue)) {
            setSelectedOptions(selectedOptions.filter(function (option) { return option !== formattedValue; }));
        }
        else {
            setSelectedOptions(__spreadArrays(selectedOptions, [formattedValue]));
        }
    };
    return (react_1["default"].createElement(FormControl_1["default"], { fullWidth: true, className: className, size: 'small' },
        react_1["default"].createElement(InputLabel_1["default"], { id: id + "-select-label" }, label),
        react_1["default"].createElement(Select_1["default"], __assign({}, fieldRef, { variant: 'filled', error: error, labelId: id + "-select-label", id: id, multiple: true, open: open, autoFocus: false, onOpen: function () { return setOpen(true); }, style: __assign(__assign({}, style), { background: (selectedOptions === null || selectedOptions === void 0 ? void 0 : selectedOptions.length) ? '#E7F1FB' : '#F0F0F0' }), value: selectedOptions.length ? selectedOptions : [label], label: label, 
            // onChange={handleChange}
            input: react_1["default"].createElement(OutlinedInput_1["default"], { label: 'Tag' }), renderValue: function (selected) {
                if (selectedOptions === null || selectedOptions === void 0 ? void 0 : selectedOptions.length) {
                    return react_1["default"].createElement("div", { style: {
                            position: 'relative',
                            top: 2
                        } }, label + " (" + selected.length + ")");
                }
                else {
                    return react_1["default"].createElement("div", { style: {
                            color: 'rgba(0, 0, 0, 0.6)',
                            position: 'relative',
                            top: 2
                        } }, label);
                }
            } }),
            react_1["default"].createElement(popContainer_1["default"], { name: label, multiple: true, onClose: function () {
                    setSelectedOptions(valueRef.current);
                    setOpen(false);
                }, onSave: function () {
                    onSelect(selectedOptions);
                    valueRef.current = selectedOptions;
                    setOpen(false);
                }, onReset: function () { return setSelectedOptions([]); } }, options &&
                options.map(function (option) {
                    var _a, _b, _c, _d;
                    return (react_1["default"].createElement(MenuItem_1["default"], { key: option.value, value: option.value, onClick: function () { return handleChange(option.value); } },
                        react_1["default"].createElement(ListItemText_1["default"], { primary: option.label, style: {
                                color: ((_a = selectedOptions === null || selectedOptions === void 0 ? void 0 : selectedOptions.indexOf) === null || _a === void 0 ? void 0 : _a.call(selectedOptions, (_b = option.value) === null || _b === void 0 ? void 0 : _b.toLowerCase())) > -1 ? '#136FD3' : undefined
                            } }),
                        ((_c = selectedOptions === null || selectedOptions === void 0 ? void 0 : selectedOptions.indexOf) === null || _c === void 0 ? void 0 : _c.call(selectedOptions, (_d = option.value) === null || _d === void 0 ? void 0 : _d.toLowerCase())) > -1 ?
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("svg", { width: "19", height: "14", viewBox: "0 0 19 14", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                                    react_1["default"].createElement("path", { d: "M17.4545 2L7.14566 12L2 7", stroke: "#136FD3", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }))) : null));
                })))));
};
exports["default"] = MultipleSelect;
