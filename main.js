const monthNames = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];

const dayNames = [
	"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const currentYear = new Date().getFullYear();

function initialiseCalendar(year) {
	const calendar = document.createElement("article");
	calendar.classList.add("calendar");

	for (let i = 0; i < monthNames.length; i++) {
		const section = document.createElement("section");

		// Build calendar headers - titles and day initials
		const header = document.createElement("header");

		const title = document.createElement("h2");
		title.innerHTML = getTitle(year, i);
		header.appendChild(title);

		const days = document.createElement("ul");
		dayNames.forEach(function(day) {
			const li = document.createElement("li");
			li.innerHTML = day.substring(0, 1);
			days.appendChild(li);
		});
		header.appendChild(days);

		section.appendChild(header);

		// Build calendar month
		const main = document.createElement("main");
		const dates = document.createElement("ul");
		buildCalendarMonth(dates, year, i);
		main.appendChild(dates);
		section.appendChild(main);

		calendar.appendChild(section);
	}

	document.body.appendChild(calendar);
}

function buildCalendarMonth(element, year, month) {
	const offsetAmount = getDayOfDate(year, month, 1);
	if (offsetAmount > 0) {
		createEmptyCells(element, offsetAmount);
	}

	const daysInMonth = getDaysInMonth(year, month);
	for (let i = 1; i <= daysInMonth; i++) {
		const li = document.createElement("li");

		li.classList.add("day");
		li.dataset.clickCount = 0;
		li.addEventListener("click", clickDay, false);

		const value = document.createElement("span");
		value.classList.add("value");
		value.innerHTML = i;
		li.appendChild(value);

		const counter = document.createElement("span");
		counter.classList.add("counter");
		li.appendChild(counter);

		element.appendChild(li);
	}

	const remainderAmount = 7 - ((daysInMonth + offsetAmount) % 7);
	if (remainderAmount < 7) {
		createEmptyCells(element, remainderAmount);
	}
}

function getDaysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

function getDayOfDate(year, month, day) {
	return new Date(year, month, day).getDay();
}

function getTitle(year, month) {
	return monthNames[month] + " " + year;
}

function createEmptyCells(element, amount) {
	for (let i = 0; i < amount; i++) {
		const li = document.createElement("li");
		li.classList.add("empty");
		element.appendChild(li);
	}
}

function clickDay() {
	let clickCount = this.dataset.clickCount;
	const counter = this.querySelector(".counter");

	clickCount++;
	this.dataset.clickCount = clickCount;
	counter.innerHTML = clickCount;

	if (clickCount > 0) {
		this.classList.add("clicked");
		counter.style.display = "inline-block";
	} else {
		this.classList.remove("clicked");
		counter.style.display = "none";
	}

	buildClickedDaysArray();
}

function firstParent(node, definedParent) {
	let finalParent = document.body;

	if (definedParent !== undefined) {
		finalParent = document.querySelector(definedParent);
	}

	if (node.parentElement === finalParent) {
		return node;
	} else {
		return firstParent(node.parentElement, definedParent);
	}
}

function buildClickedDaysArray() {
	const clickedDays = document.querySelectorAll(".clicked");
	const textarea = document.querySelector("textarea");

	let daySelections = [];

	clickedDays.forEach(function(day) {
		const dayValue = day.querySelector(".value").textContent;
		const titleValue = firstParent(day, ".calendar").querySelector("h2").textContent;

		for (let i = 0; i < day.dataset.clickCount; i++) {
			daySelections.push([dayValue + " " + titleValue]);
		}
	});

	let csvContent = "";

	daySelections.forEach(function (rowArray) {
		let row = rowArray.join(",");
		csvContent += row + "\r\n";
	});

	textarea.value = csvContent;
}

initialiseCalendar(currentYear);
