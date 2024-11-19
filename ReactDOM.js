export function render(reactElement, root) {
	if (!root) {
		throw new Error("where is the root element");
	} else if (!reactElement) {
		throw new Error("where is the react element");
	}
	const browserDOMElements = createDOMElement(reactElement);
	if (Array.isArray(browserDOMElements)) {
		root.append(...browserDOMElements);
	} else {
		root.append(browserDOMElements);
	}
}

function createDOMElement(reactElement) {
	// Check if reactElement is valid
	if (
		typeof reactElement !== "object" ||
		reactElement === null ||
		(Object.getPrototypeOf(reactElement) !== Object.prototype &&
			!Array.isArray(reactElement))
	) {
		throw new Error("Please provide a valid react element");
	}

	if (typeof reactElement.type === "function") {
		const returnValues = reactElement.type(reactElement?.props);
		if (
			typeof returnValues !== "object" ||
			returnValues === null ||
			Object.getPrototypeOf(returnValues) !== Object.prototype
		) {
			throw new Error("Please return a valid react element");
		}
		if (Array.isArray(returnValues)) {
			const domElements = returnValues.map((ele) => createDOMElement(ele));
			return domElements;
		} else {
			return createDOMElement(returnValues);
		}
	}

	if (Array.isArray(reactElement)) {
		const domElements = reactElement.map((ele) => createDOMElement(ele));
		return domElements;
	}

	// 1. create browser DOM Element to reactElement
	const { type, props } = reactElement;
	if ((!type, !props)) return;
	const domElement = document.createElement(type);

	// 2. append children in domElement
	if (props?.children) {
		props.children.forEach((child) => {
			if (typeof child === "string") {
				const textNodes = document.createTextNode(child);
				domElement.append(textNodes);
			} else if (typeof child?.type === "string") {
				const childDomElement = createDOMElement(child);
				domElement.append(childDomElement);
			} else if (Array.isArray(child)) {
				const childrenNodes = child.map((node) => createDOMElement(node));
				domElement.append(...childrenNodes);
			} else {
				domElement.append(child);
			}
		});
	}
	// 3. set element attribuites

	Object.entries(props).forEach(([key, value]) => {
		if (key === "children") return;
		if (key === "style") {
			Object.entries(value).forEach(([styleName, styleValue]) => {
				domElement.style[styleName] = styleValue;
			});
			return;
		}
		domElement[key] = value;
	});

	return domElement;
}
export default { render };
