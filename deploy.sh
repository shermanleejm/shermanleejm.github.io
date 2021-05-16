cd /Users/shrmnl/Github/portfolio && \
npm run build && \
cp -a build/. ghPage/ && \
rm -R build && \
cd ghPage && \
touch .nojekyll && \
git add . && \ 
git commit -m "lalala" &&\
git push