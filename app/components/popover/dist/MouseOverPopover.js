"use strict";
exports.__esModule = true;
exports.MouseOverPopover = exports.isContentOverflowing = void 0;
var react_1 = require("react");
var index_module_scss_1 = require("../../[lang]/company/[keyword]/components/InfoList/index.module.scss");
var Popover_1 = require("@mui/material/Popover");
var Typography_1 = require("@mui/material/Typography");
var link_1 = require("next/link");
var classnames_1 = require("classnames");
var InfoList_1 = require("../../[lang]/company/[keyword]/components/InfoList");
function isContentOverflowing(element) {
    console.log(' element?.scrollWidth ', element, element === null || element === void 0 ? void 0 : element.scrollWidth, element === null || element === void 0 ? void 0 : element.clientWidth);
    return (element === null || element === void 0 ? void 0 : element.scrollWidth) > (element === null || element === void 0 ? void 0 : element.clientWidth);
}
exports.isContentOverflowing = isContentOverflowing;
function MouseOverPopover(props) {
    var _a;
    var ref = react_1.useRef(null);
    var _b = react_1.useState(false), showPop = _b[0], setShow = _b[1];
    var _c = react_1["default"].useState(null), anchorEl = _c[0], setAnchorEl = _c[1];
    var is_url = InfoList_1.isURL(props.value);
    var handlePopoverOpen = function (event) {
        if (!showPop)
            return;
        setAnchorEl(event.currentTarget);
    };
    var handlePopoverClose = function () {
        setAnchorEl(null);
    };
    var open = Boolean(anchorEl);
    react_1.useLayoutEffect(function () {
        if (isContentOverflowing(ref.current)) {
            setShow(true);
        }
    });
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: classnames_1["default"](index_module_scss_1["default"].overview_item_value, (_a = {},
                _a[props.className] = !!props.className,
                _a)), "aria-owns": open ? 'mouse-over-popover' : undefined, "aria-haspopup": "true", onMouseEnter: handlePopoverOpen, onMouseLeave: handlePopoverClose, ref: ref }, is_url ?
            react_1["default"].createElement(link_1["default"], { href: props.value, target: "_blank", title: props.value }, props.value) :
            react_1["default"].createElement("span", null, props.value)),
        react_1["default"].createElement(Popover_1["default"], { id: "mouse-over-popover", sx: {
                pointerEvents: 'none'
            }, open: open, anchorEl: anchorEl, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'left'
            }, onClose: handlePopoverClose, disableRestoreFocus: true },
            react_1["default"].createElement(Typography_1["default"], { sx: { p: 1 }, maxWidth: 300, style: { wordBreak: 'break-all', fontSize: 14 } }, props.value))));
}
exports.MouseOverPopover = MouseOverPopover;
