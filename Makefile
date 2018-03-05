
PHONY: watch

watch:
	ag -l | entr -rc chrome-cli reload
