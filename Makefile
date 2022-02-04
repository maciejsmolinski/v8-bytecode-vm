SOURCES=$(wildcard examples/*.js)
OUTPUTS=$(subst js,bytecode,$(SOURCES))

examples/%.bytecode: examples/%.js
	@ node --print-bytecode --print-bytecode-filter=main $< > $@
	@ echo "✓ Generated" $@

default: $(OUTPUTS)

clean: 
	@ rm -f examples/*.bytecode
	@ echo "✓ Done"

install:
	@ npm install

test:
	@ npm run test

tdd:
	@ npm run test:watch

lint:
	@ npm run lint:js

start:
	@ DEBUG=1 node scripts/start.js

watch:
	@ DEBUG=1 npx nodemon scripts/start.js