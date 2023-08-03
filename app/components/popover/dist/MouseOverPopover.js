"use strict";
exports.__esModule = true;
exports.MouseOverPopover = exports.isContentOverflowing = void 0;
const react_1 = require("react");
const index_module_scss_1 = require("../../[lang]/company/[keyword]/components/InfoList/index.module.scss");
const Popover_1 = require("@mui/material/Popover");
const Typography_1 = require("@mui/material/Typography");
const link_1 = require("next/link");
const classnames_1 = require("classnames");
const InfoList_1 = require("../../[lang]/company/[keyword]/components/InfoList");
function isContentOverflowing(element) {
    console.log(' element?.scrollWidth ', element, element === null || element === void 0 ? void 0 : element.scrollWidth, element === null || element === void 0 ? void 0 : element.clientWidth);
    return (element === null || element === void 0 ? void 0 : element.scrollWidth) > (element === null || element === void 0 ? void 0 : element.clientWidth);
}
exports.isContentOverflowing = isContentOverflowing;
function MouseOverPopover(props) {
    const _a;
    const ref = react_1.useRef(null);
    const _b = react_1.useState(false); const showPop = _b[0];
     const setShow = _b[1];
    const _c = react_1["default"].useState(null);
     const anchorEl = _c[0]; const setAnchorEl = _c[1];
    const is_url = InfoList_1.isURL(props.value);
    const handlePopoverOpen = function (event) {
        if (!showPop)
            return;
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = function () {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
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
