#!/usr/bin/python3
# Compiles my website into html from markdown
import markdown
import os
from puppies import create_puppy_image

DIRS = ['blog']
MDDIR = 'mdsrc'
HTTPDIR = 'serve'

def build_index(dirs):
    body = open(os.path.join(MDDIR, 'header.html'), 'r').read()
    indexmd = open(os.path.join(MDDIR, 'index.md'), 'r').read()
    footer = open(os.path.join(MDDIR, 'footer.html'), 'r').read()
    body += '\n'
    body += markdown.markdown(indexmd)
    body += '\n'

    for dirname in dirs:
        path = os.path.join(MDDIR, dirname)
        label = dirname
        files = os.listdir(path)
        files.sort(key=lambda x: os.path.getmtime(os.path.join(path, x)))
        section = '## {} \n'.format(label)
        
        for filename in files:
            filepath = os.path.join(path, filename)
            content = open(filepath, 'r').read()
            name = filename.split('.')[0]
            title = content.split('\n')[0][1:]

            section += '- [{}](/{}.html)\n'.format(title, name)

        body += markdown.markdown(section)
        body += '\n'
    
    body += footer
    with open(os.path.join(HTTPDIR, 'index.html'), 'w') as indexfile:
        indexfile.write(body)

def build_dirs(dirs):
    for dirname in dirs:
        path = os.path.join(MDDIR, dirname)
        files = os.listdir(path)
        files.sort(key=lambda x: os.path.getmtime(os.path.join(path, x)))
        
        for filename in files:
            body = open(os.path.join(MDDIR, 'header.html'), 'r').read()
            filepath = os.path.join(path, filename)
            content = open(filepath, 'r').read()
            name = filename.split('.')[0]
            
            body += markdown.markdown(content)
            with open(os.path.join(HTTPDIR, name + '.html'), 'w') as dirfile:
                dirfile.write(body)


if __name__ == '__main__':
    build_index(DIRS)
    build_dirs(DIRS)
    create_puppy_image()

