import path from 'path';
import { writeFile, readFile } from 'fs/promises';

export const writeFileAsync = async (folderName, fileName, data) => {
  try {
    const filePath = path.join(__appdir, folderName, fileName);
    await writeFile(filePath, data + '\n');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const readFileAsync = async (folderName, fileName) => {
    try {
        const filePath = path.join(__appdir, folderName, fileName);
        const data = await readFile(filePath, 'utf-8');
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}


// export const updateBlockchainFile = async (folderName, fileName, block) => {
//   try {
//     const filePath = path.join(__appdir, folderName, fileName);

//     let data = await readFile(filePath, { encoding: 'utf8' });
//     let blockchainData = data ? JSON.parse(data) : [];
//     blockchainData.push(block);
//     await writeFile(filePath, blockchainData);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

