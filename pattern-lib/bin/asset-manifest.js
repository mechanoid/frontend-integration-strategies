#!/usr/bin/env node
import { join } from 'path'
import { URL } from 'url';
import { readdir } from 'fs/promises'
import fsExtra from 'fs-extra'
const { outputJson } = fsExtra

const assetsManifest = async (path) => {
  const groupDirectories = await readdir(path)
  const groupFiles = await Promise.all(groupDirectories.map(group => readdir(join(path, group))))

  return groupDirectories.reduce((result, group, groupIndex) =>{
    result[group] = groupFiles[groupIndex].map(file => new URL(join('assets', group, file), 'http://localhost:5000'))
    return result
  }, {})
}

try {
  const manifest = await assetsManifest('./assets')

  try {
    await outputJson('./dist/manifest.json', manifest)
    console.log('wrote dist/manifest.json');
  } catch (e) {
    console.log('writing manifest file failed, due to', e.message);
  }
} catch (e) {
  console.log('failed to create manifest file, due to', e.message);
}

