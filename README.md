# faustware
My personal website

## File structure
The folder mdsrc is where the markdown source files are stored. `index.md` is the file that is compiled into `index.html`. 
The file `header.html` is the header that is added to all markdown files.
Folders in mdsrc represent different sections of the website and the markdown files in them are the posts in those sections.

## Compiling the html
`python3 compile_website.py` will compile the website into html files under the serve folders which should be used as the root http folder.

## Website structure
The structure for `index.html` is the following:

```
title

description

section 1
  - latest post
  - second latest post
  ...

section 2
  - latest post
  ...
```
