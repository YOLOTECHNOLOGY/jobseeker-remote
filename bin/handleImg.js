const fs = require('fs');
const path = require('path');

const folderPath = 'app/[lang]/landing'; // 替换为要遍历的文件夹路径

// 判断是否为图片文件
function isImageFile(filePath) {
	const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'];
	const ext = path.extname(filePath).toLowerCase();
	return imageExtensions.includes(ext);
}

// 递归遍历文件夹
function traverseFolder(folderPath) {
	fs.readdirSync(folderPath).forEach((file) => {
		const filePath = path.resolve(folderPath, file);

		// 如果是文件夹，则递归遍历
		if (fs.statSync(filePath).isDirectory()) {
			traverseFolder(filePath);
		} else if (!isImageFile(filePath)) {
			// 读取文件内容
			let fileContent = fs.readFileSync(filePath, 'utf-8');

			// 替换字符串
			fileContent = fileContent.replace(/require\((.*?)\)\.default\.src/g, (_, match) => {
				// 获取匹配到的字符串
				const requireStatement = match.trim();

				// 判断字符串是否以单引号或双引号包裹
				const isWrappedWithQuotes = /^['"]/.test(requireStatement) && /['"]$/.test(requireStatement);

				// 提取文件名
				const fileName = path.basename(requireStatement);

				// 构建替换后的字符串
				const replacedStatement = `\`\${process.env.S3_BUCKET_URL}/landing/${fileName}\``;

				// 返回替换后的字符串
				return replacedStatement;
			});


			// 写入修改后的文件内容
			fs.writeFileSync(filePath, fileContent, 'utf-8');
		}
	});
}

// 调用遍历函数
traverseFolder(folderPath);