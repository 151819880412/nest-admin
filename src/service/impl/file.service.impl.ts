import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import * as multer from 'multer';
import { Formt } from 'src/utils/DateFormt';
import { FileEntity } from 'src/pojo/entity/file.entity';
import { R } from 'src/response/R';
import { BaseService } from '../Base.service';
import { InjectRepository } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs'); // 文件系统模块，用于读写文件
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compiler = require('vue-template-compiler'); // Vue模板编译器
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path'); // 路径处理模块
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { rewriteDefault, compileStyle } = require('@vue/compiler-sfc'); // 重写默认导出
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { build } = require('esbuild'); // JavaScript打包工具

@Injectable()
export class FileService
  extends BaseService<FileEntity>
  implements MulterOptionsFactory
{
  constructor(
    @InjectRepository(FileEntity) fileEntityRepository: Repository<FileEntity>,
  ) {
    super(fileEntityRepository);
  }

  async uploadFile(file) {
    // 查询数据库，检查是否存在相同文件名的文件
    const existingFile = await this.findOne({
      where: {
        fileName: file.originalname,
      },
    });

    if (existingFile) {
      // 保存文件信息到数据库
      this.updateBy(
        {
          where: {
            fileName: file.originalname,
          },
        },
        {
          fileName: file.originalname,
          version: +existingFile.version * 1 + 1 + '',
        } as FileEntity,
      );
    } else {
      // 保存文件信息到数据库
      this.saveOne({
        fileName: file.originalname,
        version: '1',
      } as FileEntity);
    }
    // 将文件保存到指定目录
    // 这里使用 fs 模块进行保存，也可以使用其他方式
    const currentTime = Formt('yyyy-MM-dd HH:mm:ss').replace(/:/g, '-');
    const currentDate = Formt('yyyy-MM-dd');
    const filrNanme = currentTime + '-' + file.originalname;
    const filePath = `./fileUpload/${currentDate}/${filrNanme}`;
    fs.writeFileSync(filePath, file.buffer);
    // 解析vue文件
    if (
      file.originalname.split('.').length > 0 &&
      file.originalname.split('.')[file.originalname.split('.').length - 1] ==
        'vue'
    ) {
      const outPath = `./fileUpload/${currentDate}/${currentTime}`;
      this.vueToJs(filePath, outPath);
    }
    return R.ok('文件保存成功!');
  }

  createMulterOptions(): MulterModuleOptions {
    try {
      return {
        storage: multer.diskStorage({
          //自定义路径
          destination: `./fileUpload/${Formt('yyyy-MM-dd')}`,
          filename: (req, file, cb) => {
            // 自定义文件名
            const filename = Buffer.from(file.originalname, 'latin1').toString(
              'utf8',
            );
            return cb(null, filename);
          },
        }),
      };
    } catch (error) {
      console.error(error);
    }
  }

  vueToJs(filePath: string, outPath: string) {
    const vueFilePath = path.resolve(filePath); // 解析.vue文件路径
    const vueFileContent = fs.readFileSync(vueFilePath, 'utf-8'); // 读取.vue文件内容
    const { template, script, styles } =
      compiler.parseComponent(vueFileContent); // 解析.vue文件的内容

    const id = Date.now().toString(); // 生成唯一的ID
    const scopeId = `data-v-${id}`; // 生成唯一的scopeId，用于CSS作用域

    const compilerOptions = {
      modules: [
        {
          preTransformNode: (el) => {
            // 在这里可以修改元素的属性，添加唯一标识
            el.attrsMap[scopeId] = '';
            el.attrsList.push({ name: scopeId, value: '' });
            return el;
          },
        },
      ],
    };

    const compiled = compiler.compile(template.content, compilerOptions); // 编译模板

    if (compiled.errors && compiled.errors.length) {
      console.error(compiled.errors); // 如果编译出错，输出错误信息
      return;
    }

    const codeList = []; // 存储生成的代码
    let render = compiled.render.toString(); // 获取渲染函数的字符串表示

    codeList.push(rewriteDefault(script.content, '__sfc_main__')); // 重写默认导出
    codeList.push(`__sfc_main__.__scopeId = '${scopeId}'`); // 设置组件的scopeId
    render = render.replace(/'/g, '"'); // 将字符串中的单引号替换为双引号，以保持一致性

    codeList.push(`__sfc_main__.render = new Function('${render}')`); // 将渲染函数代码添加到代码列表中
    codeList.push('export default __sfc_main__'); // 默认导出组件对象

    for (const styleBlock of styles) {
      const styleCode = compileStyle({
        source: styleBlock.content,
        id,
        filename: 'main.vue',
        scoped: styleBlock.scoped,
      });
      const styleDOM = `
        var el = document.createElement('style')
        el.innerHTML =  \`${styleCode.code}\`
        document.body.append(el);
      `;
      codeList.push(styleDOM);
    }

    fs.writeFileSync(outPath + '.temp.js', codeList.join('\n'), 'utf8'); // 将生成的代码写入到aaaa.js文件
    console.log('渲染函数已写入到build.temp.js文件');

    build({
      entryPoints: [`${outPath}.temp.js`], // 入口文件为aaaa.js
      bundle: true, // 打包为单个文件
      outfile: outPath + '.js', // 输出文件名为bundle1.js
      external: ['vue'], // 将Vue标记为外部依赖
    })
      .then(() => {
        let bundleContent = fs.readFileSync('bundle.js', 'utf8'); // 读取生成的bundle1.js文件的内容
        const insertStr = '  return __sfc_main__;\n'; // 要插入的字符串
        const position = bundleContent.length - 6; // 要插入的位置

        bundleContent =
          bundleContent.slice(0, position) +
          insertStr +
          bundleContent.slice(position); // 插入字符串

        fs.writeFileSync(outPath + '.js', bundleContent, 'utf8'); // 重新写入修改后的内容
      })
      .catch((err) => {
        console.error(err); // 如果打包出错，输出错误信息
        process.exit(1);
      });
  }
}
