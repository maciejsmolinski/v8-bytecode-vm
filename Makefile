SOURCES=$(wildcard *.js)
OUTPUTS=$(subst js,profile,$(SOURCES))

%.profile: %.js
	@ node --print-bytecode --print-bytecode-filter=main $< > $@

default: $(OUTPUTS)

clean: 
	@ rm -f *.profile

