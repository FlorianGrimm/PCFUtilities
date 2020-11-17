module.exports = {
    browser:"chrome",
	launch: {
        executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
		dumpio: true,
		headless: false,
		args: ['--disable-infobars'],
	},
	browserContext: 'default'
};