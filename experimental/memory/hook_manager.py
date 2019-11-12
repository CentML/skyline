import logging

logger = logging.getLogger(__name__)


class HookManager:
    def __init__(self):
        self._original_callables = {}

    def attach_hooks_on_module(self, module, predicate, hook_creator):
        for prop in dir(module):
            if not predicate(getattr(module, prop)):
                continue
            self.attach_hook(module, prop, hook_creator)

    def attach_hook(self, module, prop, hook_creator):
        target = getattr(module, prop)
        logger.debug('Adding hook to callable: %s', target.__name__)
        self._maybe_store_callable(module, prop, target)
        setattr(module, prop, hook_creator(target))

    def remove_hooks(self):
        for module, callable_pairs in self._original_callables.items():
            for prop, original_callable in callable_pairs.items():
                setattr(module, prop, original_callable)
        self._original_callables.clear()

    def _maybe_store_callable(self, module, prop, original_callable):
        """
        Store the original callable (to be able to restore it) only when it is
        the first time we are encountering the given callable.
        """
        if module not in self._original_callables:
            self._original_callables[module] = {}

        if prop in self._original_callables[module]:
            return

        self._original_callables[module][prop] = original_callable
