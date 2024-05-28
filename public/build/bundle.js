
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    // Adapted from https://github.com/then/is-promise/blob/master/index.js
    // Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
    function is_promise(value) {
        return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    /**
     * List of attributes that should always be set through the attr method,
     * because updating them through the property setter doesn't work reliably.
     * In the example of `width`/`height`, the problem is that the setter only
     * accepts numeric values, but the attribute can also be set to a string like `50%`.
     * If this list becomes too big, rethink this approach.
     */
    const always_set_through_set_attribute = ['width', 'height'];
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const LOCATION = {};
    const ROUTER = {};
    const HISTORY = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const PARAM = /^:(.+)/;
    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Split up the URI into segments delimited by `/`
     * Strip starting/ending `/`
     * @param {string} uri
     * @return {string[]}
     */
    const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
    /**
     * Strip `str` of potential start and end `/`
     * @param {string} string
     * @return {string}
     */
    const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    const rankRoute = (route, index) => {
        const score = route.default
            ? 0
            : segmentize(route.path).reduce((score, segment) => {
                  score += SEGMENT_POINTS;

                  if (segment === "") {
                      score += ROOT_POINTS;
                  } else if (PARAM.test(segment)) {
                      score += DYNAMIC_POINTS;
                  } else if (segment[0] === "*") {
                      score -= SEGMENT_POINTS + SPLAT_PENALTY;
                  } else {
                      score += STATIC_POINTS;
                  }

                  return score;
              }, 0);

        return { route, score, index };
    };
    /**
     * Give a score to all routes and sort them on that
     * If two routes have the exact same score, we go by index instead
     * @param {object[]} routes
     * @return {object[]}
     */
    const rankRoutes = (routes) =>
        routes
            .map(rankRoute)
            .sort((a, b) =>
                a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
            );
    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    const pick = (routes, uri) => {
        let match;
        let default_;

        const [uriPathname] = uri.split("?");
        const uriSegments = segmentize(uriPathname);
        const isRootUri = uriSegments[0] === "";
        const ranked = rankRoutes(routes);

        for (let i = 0, l = ranked.length; i < l; i++) {
            const route = ranked[i].route;
            let missed = false;

            if (route.default) {
                default_ = {
                    route,
                    params: {},
                    uri,
                };
                continue;
            }

            const routeSegments = segmentize(route.path);
            const params = {};
            const max = Math.max(uriSegments.length, routeSegments.length);
            let index = 0;

            for (; index < max; index++) {
                const routeSegment = routeSegments[index];
                const uriSegment = uriSegments[index];

                if (routeSegment && routeSegment[0] === "*") {
                    // Hit a splat, just grab the rest, and return a match
                    // uri:   /files/documents/work
                    // route: /files/* or /files/*splatname
                    const splatName =
                        routeSegment === "*" ? "*" : routeSegment.slice(1);

                    params[splatName] = uriSegments
                        .slice(index)
                        .map(decodeURIComponent)
                        .join("/");
                    break;
                }

                if (typeof uriSegment === "undefined") {
                    // URI is shorter than the route, no match
                    // uri:   /users
                    // route: /users/:userId
                    missed = true;
                    break;
                }

                const dynamicMatch = PARAM.exec(routeSegment);

                if (dynamicMatch && !isRootUri) {
                    const value = decodeURIComponent(uriSegment);
                    params[dynamicMatch[1]] = value;
                } else if (routeSegment !== uriSegment) {
                    // Current segments don't match, not dynamic, not splat, so no match
                    // uri:   /users/123/settings
                    // route: /users/:id/profile
                    missed = true;
                    break;
                }
            }

            if (!missed) {
                match = {
                    route,
                    params,
                    uri: "/" + uriSegments.slice(0, index).join("/"),
                };
                break;
            }
        }

        return match || default_ || null;
    };
    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) => pathname + (query ? `?${query}` : "");
    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    const resolve$1 = (to, base) => {
        // /foo/bar, /baz/qux => /foo/bar
        if (to.startsWith("/")) return to;

        const [toPathname, toQuery] = to.split("?");
        const [basePathname] = base.split("?");
        const toSegments = segmentize(toPathname);
        const baseSegments = segmentize(basePathname);

        // ?a=b, /users?b=c => /users?a=b
        if (toSegments[0] === "") return addQuery(basePathname, toQuery);

        // profile, /users/789 => /users/789/profile

        if (!toSegments[0].startsWith(".")) {
            const pathname = baseSegments.concat(toSegments).join("/");
            return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
        }

        // ./       , /users/123 => /users/123
        // ../      , /users/123 => /users
        // ../..    , /users/123 => /
        // ../../one, /a/b/c/d   => /a/b/one
        // .././one , /a/b/c/d   => /a/b/c/one
        const allSegments = baseSegments.concat(toSegments);
        const segments = [];

        allSegments.forEach((segment) => {
            if (segment === "..") segments.pop();
            else if (segment !== ".") segments.push(segment);
        });

        return addQuery("/" + segments.join("/"), toQuery);
    };
    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    const combinePaths = (basepath, path) =>
        `${stripSlashes(
        path === "/"
            ? basepath
            : `${stripSlashes(basepath)}/${stripSlashes(path)}`
    )}/`;
    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    const shouldNavigate = (event) =>
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

    const canUseDOM = () =>
        typeof window !== "undefined" &&
        "document" in window &&
        "location" in window;

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.59.2 */
    const file$8 = "node_modules\\svelte-routing\\src\\Link.svelte";
    const get_default_slot_changes$2 = dirty => ({ active: dirty & /*ariaCurrent*/ 4 });
    const get_default_slot_context$2 = ctx => ({ active: !!/*ariaCurrent*/ ctx[2] });

    function create_fragment$9(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], get_default_slot_context$2);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$8, 41, 0, 1414);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, ariaCurrent*/ 65540)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps","preserveScroll"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	let { preserveScroll = false } = $$props;
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(14, $location = value));
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(15, $base = value));
    	const { navigate } = getContext(HISTORY);
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	const onClick = event => {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, {
    				state,
    				replace: shouldReplace,
    				preserveScroll
    			});
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('preserveScroll' in $$new_props) $$invalidate(11, preserveScroll = $$new_props.preserveScroll);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getContext,
    		HISTORY,
    		LOCATION,
    		ROUTER,
    		resolve: resolve$1,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		preserveScroll,
    		location,
    		base,
    		navigate,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$new_props.preserveScroll);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(12, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(13, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 32896) {
    			$$invalidate(0, href = resolve$1(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 16385) {
    			$$invalidate(12, isPartiallyCurrent = $location.pathname.startsWith(href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 16385) {
    			$$invalidate(13, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 8192) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		$$invalidate(1, props = getProps({
    			location: $location,
    			href,
    			isPartiallyCurrent,
    			isCurrent,
    			existingProps: $$restProps
    		}));
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		base,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		preserveScroll,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10,
    			preserveScroll: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preserveScroll() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preserveScroll(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.59.2 */
    const get_default_slot_changes$1 = dirty => ({ params: dirty & /*routeParams*/ 4 });
    const get_default_slot_context$1 = ctx => ({ params: /*routeParams*/ ctx[2] });

    // (42:0) {#if $activeRoute && $activeRoute.route === route}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/ 132)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(51:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#if component}
    function create_if_block_1$2(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 12,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*component*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*component*/ 1 && promise !== (promise = /*component*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(43:4) {#if component}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     import { getContext, onDestroy }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop$1,
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>     import { getContext, onDestroy }",
    		ctx
    	});

    	return block;
    }

    // (44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}
    function create_then_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*routeParams*/ ctx[2], /*routeProps*/ ctx[3]];
    	var switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*routeParams, routeProps*/ 12)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     import { getContext, onDestroy }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop$1,
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script>     import { getContext, onDestroy }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let routeParams = {};
    	let routeProps = {};
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	registerRoute(route);

    	onDestroy(() => {
    		unregisterRoute(route);
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(6, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		canUseDOM,
    		path,
    		component,
    		routeParams,
    		routeProps,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		route,
    		$activeRoute
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(6, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($activeRoute && $activeRoute.route === route) {
    			$$invalidate(2, routeParams = $activeRoute.params);
    			const { component: c, path, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);

    			if (c) {
    				if (c.toString().startsWith("class ")) $$invalidate(0, component = c); else $$invalidate(0, component = c());
    			}

    			canUseDOM() && !$activeRoute.preserveScroll && window?.scrollTo(0, 0);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		activeRoute,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { path: 6, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const getLocation = (source) => {
        return {
            ...source.location,
            state: source.history.state,
            key: (source.history.state && source.history.state.key) || "initial",
        };
    };
    const createHistory = (source) => {
        const listeners = [];
        let location = getLocation(source);

        return {
            get location() {
                return location;
            },

            listen(listener) {
                listeners.push(listener);

                const popstateListener = () => {
                    location = getLocation(source);
                    listener({ location, action: "POP" });
                };

                source.addEventListener("popstate", popstateListener);

                return () => {
                    source.removeEventListener("popstate", popstateListener);
                    const index = listeners.indexOf(listener);
                    listeners.splice(index, 1);
                };
            },

            navigate(to, { state, replace = false, preserveScroll = false, blurActiveElement = true } = {}) {
                state = { ...state, key: Date.now() + "" };
                // try...catch iOS Safari limits to 100 pushState calls
                try {
                    if (replace) source.history.replaceState(state, "", to);
                    else source.history.pushState(state, "", to);
                } catch (e) {
                    source.location[replace ? "replace" : "assign"](to);
                }
                location = getLocation(source);
                listeners.forEach((listener) =>
                    listener({ location, action: "PUSH", preserveScroll })
                );
                if(blurActiveElement) document.activeElement.blur();
            },
        };
    };
    // Stores history entries in memory for testing or other platforms like Native
    const createMemorySource = (initialPathname = "/") => {
        let index = 0;
        const stack = [{ pathname: initialPathname, search: "" }];
        const states = [];

        return {
            get location() {
                return stack[index];
            },
            addEventListener(name, fn) {},
            removeEventListener(name, fn) {},
            history: {
                get entries() {
                    return stack;
                },
                get index() {
                    return index;
                },
                get state() {
                    return states[index];
                },
                pushState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    index++;
                    stack.push({ pathname, search });
                    states.push(state);
                },
                replaceState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    stack[index] = { pathname, search };
                    states[index] = state;
                },
            },
        };
    };
    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const globalHistory = createHistory(
        canUseDOM() ? window : createMemorySource()
    );

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file$7 = "node_modules\\svelte-routing\\src\\Router.svelte";

    const get_default_slot_changes_1 = dirty => ({
    	route: dirty & /*$activeRoute*/ 4,
    	location: dirty & /*$location*/ 2
    });

    const get_default_slot_context_1 = ctx => ({
    	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
    	location: /*$location*/ ctx[1]
    });

    const get_default_slot_changes = dirty => ({
    	route: dirty & /*$activeRoute*/ 4,
    	location: dirty & /*$location*/ 2
    });

    const get_default_slot_context = ctx => ({
    	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
    	location: /*$location*/ ctx[1]
    });

    // (143:0) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(143:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (134:0) {#if viewtransition}
    function create_if_block$3(ctx) {
    	let previous_key = /*$location*/ ctx[1].pathname;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$location*/ 2 && safe_not_equal(previous_key, previous_key = /*$location*/ ctx[1].pathname)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$1);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(134:0) {#if viewtransition}",
    		ctx
    	});

    	return block;
    }

    // (135:4) {#key $location.pathname}
    function create_key_block(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$7, 135, 8, 4659);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*viewtransitionFn*/ ctx[3], {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*viewtransitionFn*/ ctx[3], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(135:4) {#key $location.pathname}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*viewtransition*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let $activeRoute;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	let { viewtransition = null } = $$props;
    	let { history = globalHistory } = $$props;

    	const viewtransitionFn = (node, _, direction) => {
    		const vt = viewtransition(direction);
    		if (typeof vt?.fn === "function") return vt.fn(node, vt); else return vt;
    	};

    	setContext(HISTORY, history);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(12, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(2, $activeRoute = value));
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : history.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(1, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (!activeRoute) return base;

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	const registerRoute = route => {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) return;

    			const matchingRoute = pick([route], $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => [...rs, route]);
    		}
    	};

    	const unregisterRoute = route => {
    		routes.update(rs => rs.filter(r => r !== route));
    	};

    	let preserveScroll = false;

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(event => {
    				$$invalidate(11, preserveScroll = event.preserveScroll || false);
    				location.set(event.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url', 'viewtransition', 'history'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(9, url = $$props.url);
    		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
    		if ('history' in $$props) $$invalidate(10, history = $$props.history);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		setContext,
    		derived,
    		writable,
    		HISTORY,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		combinePaths,
    		pick,
    		basepath,
    		url,
    		viewtransition,
    		history,
    		viewtransitionFn,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		preserveScroll,
    		$location,
    		$routes,
    		$base,
    		$activeRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(9, url = $$props.url);
    		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
    		if ('history' in $$props) $$invalidate(10, history = $$props.history);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$props.preserveScroll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 8192) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;
    				routes.update(rs => rs.map(r => Object.assign(r, { path: combinePaths(basepath, r._path) })));
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/ 6146) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch ? { ...bestMatch, preserveScroll } : bestMatch);
    			}
    		}
    	};

    	return [
    		viewtransition,
    		$location,
    		$activeRoute,
    		viewtransitionFn,
    		routes,
    		activeRoute,
    		location,
    		base,
    		basepath,
    		url,
    		history,
    		preserveScroll,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			basepath: 8,
    			url: 9,
    			viewtransition: 0,
    			history: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewtransition() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewtransition(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\ace_sat.svelte generated by Svelte v3.59.2 */

    const { console: console_1$3 } = globals;
    const file$6 = "src\\routes\\ace_sat.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div19;
    	let div18;
    	let div5;
    	let div4;
    	let h40;
    	let t3;
    	let div0;
    	let span0;
    	let t4;
    	let span1;
    	let t6;
    	let span3;
    	let span2;
    	let t7_value = /*solarWindData*/ ctx[1].bxGSM + "";
    	let t7;
    	let t8;
    	let div1;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span7;
    	let span6;
    	let t12_value = /*solarWindData*/ ctx[1].byGSM + "";
    	let t12;
    	let t13;
    	let div2;
    	let span8;
    	let t14;
    	let span9;
    	let t16;
    	let span11;
    	let span10;
    	let t17_value = /*solarWindData*/ ctx[1].bzGSM + "";
    	let t17;
    	let t18;
    	let div3;
    	let span12;
    	let t19;
    	let span13;
    	let t21;
    	let span15;
    	let span14;
    	let t22_value = /*solarWindData*/ ctx[1].bt + "";
    	let t22;
    	let t23;
    	let div17;
    	let div16;
    	let h41;
    	let t25;
    	let div6;
    	let span16;
    	let t26;
    	let span17;
    	let t28;
    	let span18;
    	let t29_value = /*earthData*/ ctx[0].latitude + "";
    	let t29;
    	let t30;
    	let div7;
    	let span19;
    	let t31;
    	let span20;
    	let t33;
    	let span21;
    	let t34_value = /*earthData*/ ctx[0].longitude + "";
    	let t34;
    	let t35;
    	let div8;
    	let span22;
    	let t36;
    	let span23;
    	let t38;
    	let span24;
    	let t39_value = /*earthData*/ ctx[0].altitude + "";
    	let t39;
    	let t40;
    	let div9;
    	let span25;
    	let t41;
    	let span26;
    	let t43;
    	let span27;
    	let t44_value = /*earthData*/ ctx[0].intensity + "";
    	let t44;
    	let t45;
    	let div10;
    	let span28;
    	let t46;
    	let span29;
    	let t48;
    	let span30;
    	let t49_value = /*earthData*/ ctx[0].declination + "";
    	let t49;
    	let t50;
    	let div11;
    	let span31;
    	let t51;
    	let span32;
    	let t53;
    	let span33;
    	let t54_value = /*earthData*/ ctx[0].inclination + "";
    	let t54;
    	let t55;
    	let div12;
    	let span34;
    	let t56;
    	let span35;
    	let t58;
    	let span36;
    	let t59_value = /*earthData*/ ctx[0].north + "";
    	let t59;
    	let t60;
    	let div13;
    	let span37;
    	let t61;
    	let span38;
    	let t63;
    	let span39;
    	let t64_value = /*earthData*/ ctx[0].east + "";
    	let t64;
    	let t65;
    	let div14;
    	let span40;
    	let t66;
    	let span41;
    	let t68;
    	let span42;
    	let t69_value = /*earthData*/ ctx[0].vertical + "";
    	let t69;
    	let t70;
    	let div15;
    	let span43;
    	let t71;
    	let span44;
    	let t73;
    	let span45;
    	let t74_value = /*earthData*/ ctx[0].horizontal + "";
    	let t74;
    	let t75;
    	let div29;
    	let div28;
    	let div27;
    	let div26;
    	let div20;
    	let h20;
    	let t77;
    	let ul0;
    	let li0;
    	let span46;
    	let t78;
    	let t79;
    	let li1;
    	let span47;
    	let t80;
    	let t81;
    	let li2;
    	let span48;
    	let t82;
    	let t83;
    	let div21;
    	let h21;
    	let t85;
    	let ul1;
    	let li3;
    	let span49;
    	let t86;
    	let t87;
    	let li4;
    	let span50;
    	let t88;
    	let t89;
    	let div22;
    	let h22;
    	let t91;
    	let ul2;
    	let li5;
    	let span51;
    	let t92;
    	let t93;
    	let li6;
    	let span52;
    	let t94;
    	let t95;
    	let div23;
    	let h23;
    	let t97;
    	let ul3;
    	let li7;
    	let span53;
    	let t98;
    	let t99;
    	let li8;
    	let span54;
    	let t100;
    	let t101;
    	let div24;
    	let h24;
    	let t103;
    	let ul4;
    	let li9;
    	let span55;
    	let t104;
    	let t105;
    	let li10;
    	let span56;
    	let t106;
    	let t107;
    	let div25;
    	let h25;
    	let t109;
    	let ul5;
    	let li11;
    	let span57;
    	let t110;
    	let t111;
    	let li12;
    	let span58;
    	let t112;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "ACE SATELLITE INFORMATIONS";
    			t1 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Solar wind";
    			t3 = space();
    			div0 = element("div");
    			span0 = element("span");
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "bx_gsm:";
    			t6 = space();
    			span3 = element("span");
    			span2 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			div1 = element("div");
    			span4 = element("span");
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "by_gsm:";
    			t11 = space();
    			span7 = element("span");
    			span6 = element("span");
    			t12 = text(t12_value);
    			t13 = space();
    			div2 = element("div");
    			span8 = element("span");
    			t14 = space();
    			span9 = element("span");
    			span9.textContent = "bz_gsm:";
    			t16 = space();
    			span11 = element("span");
    			span10 = element("span");
    			t17 = text(t17_value);
    			t18 = space();
    			div3 = element("div");
    			span12 = element("span");
    			t19 = space();
    			span13 = element("span");
    			span13.textContent = "bt:";
    			t21 = space();
    			span15 = element("span");
    			span14 = element("span");
    			t22 = text(t22_value);
    			t23 = space();
    			div17 = element("div");
    			div16 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Geo-magnetic field";
    			t25 = space();
    			div6 = element("div");
    			span16 = element("span");
    			t26 = space();
    			span17 = element("span");
    			span17.textContent = "Latitude:";
    			t28 = space();
    			span18 = element("span");
    			t29 = text(t29_value);
    			t30 = space();
    			div7 = element("div");
    			span19 = element("span");
    			t31 = space();
    			span20 = element("span");
    			span20.textContent = "Longitude:";
    			t33 = space();
    			span21 = element("span");
    			t34 = text(t34_value);
    			t35 = space();
    			div8 = element("div");
    			span22 = element("span");
    			t36 = space();
    			span23 = element("span");
    			span23.textContent = "Altitude:";
    			t38 = space();
    			span24 = element("span");
    			t39 = text(t39_value);
    			t40 = space();
    			div9 = element("div");
    			span25 = element("span");
    			t41 = space();
    			span26 = element("span");
    			span26.textContent = "Intensity:";
    			t43 = space();
    			span27 = element("span");
    			t44 = text(t44_value);
    			t45 = space();
    			div10 = element("div");
    			span28 = element("span");
    			t46 = space();
    			span29 = element("span");
    			span29.textContent = "Declination:";
    			t48 = space();
    			span30 = element("span");
    			t49 = text(t49_value);
    			t50 = space();
    			div11 = element("div");
    			span31 = element("span");
    			t51 = space();
    			span32 = element("span");
    			span32.textContent = "Inclination:";
    			t53 = space();
    			span33 = element("span");
    			t54 = text(t54_value);
    			t55 = space();
    			div12 = element("div");
    			span34 = element("span");
    			t56 = space();
    			span35 = element("span");
    			span35.textContent = "North:";
    			t58 = space();
    			span36 = element("span");
    			t59 = text(t59_value);
    			t60 = space();
    			div13 = element("div");
    			span37 = element("span");
    			t61 = space();
    			span38 = element("span");
    			span38.textContent = "East:";
    			t63 = space();
    			span39 = element("span");
    			t64 = text(t64_value);
    			t65 = space();
    			div14 = element("div");
    			span40 = element("span");
    			t66 = space();
    			span41 = element("span");
    			span41.textContent = "Vertical:";
    			t68 = space();
    			span42 = element("span");
    			t69 = text(t69_value);
    			t70 = space();
    			div15 = element("div");
    			span43 = element("span");
    			t71 = space();
    			span44 = element("span");
    			span44.textContent = "Horizontal:";
    			t73 = space();
    			span45 = element("span");
    			t74 = text(t74_value);
    			t75 = space();
    			div29 = element("div");
    			div28 = element("div");
    			div27 = element("div");
    			div26 = element("div");
    			div20 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Solar Wind Monitoring";
    			t77 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			span46 = element("span");
    			t78 = text(" Solar Wind Speed: 500 km/s");
    			t79 = space();
    			li1 = element("li");
    			span47 = element("span");
    			t80 = text(" Solar Wind Density: 5 particles/cm³");
    			t81 = space();
    			li2 = element("li");
    			span48 = element("span");
    			t82 = text(" Solar Wind Magnetic Field: 10 nT");
    			t83 = space();
    			div21 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Earth Radiation Budget";
    			t85 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			span49 = element("span");
    			t86 = text(" Earth's Albedo: 0.30");
    			t87 = space();
    			li4 = element("li");
    			span50 = element("span");
    			t88 = text(" Cloud Cover: 40%");
    			t89 = space();
    			div22 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Space Weather Alerts";
    			t91 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			span51 = element("span");
    			t92 = text(" Solar Flares: Moderate");
    			t93 = space();
    			li6 = element("li");
    			span52 = element("span");
    			t94 = text(" Geomagnetic Storms: None");
    			t95 = space();
    			div23 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Climate Research";
    			t97 = space();
    			ul3 = element("ul");
    			li7 = element("li");
    			span53 = element("span");
    			t98 = text(" Albedo Changes: 0.02 per year");
    			t99 = space();
    			li8 = element("li");
    			span54 = element("span");
    			t100 = text(" Cloud Cover Patterns: Variable");
    			t101 = space();
    			div24 = element("div");
    			h24 = element("h2");
    			h24.textContent = "Atmospheric Measurements";
    			t103 = space();
    			ul4 = element("ul");
    			li9 = element("li");
    			span55 = element("span");
    			t104 = text(" Ozone Levels: 300 Dobson Units");
    			t105 = space();
    			li10 = element("li");
    			span56 = element("span");
    			t106 = text(" Aerosol Concentrations: 15 µg/m³");
    			t107 = space();
    			div25 = element("div");
    			h25 = element("h2");
    			h25.textContent = "Space Environment Research";
    			t109 = space();
    			ul5 = element("ul");
    			li11 = element("li");
    			span57 = element("span");
    			t110 = text(" Auroras: Active");
    			t111 = space();
    			li12 = element("li");
    			span58 = element("span");
    			t112 = text(" Geomagnetic Disturbances: Low");
    			attr_dev(h1, "class", "mt-10 text-xs border-b border-white/30");
    			add_location(h1, file$6, 60, 2, 1650);
    			attr_dev(h40, "class", "p-2");
    			set_style(h40, "background", "linear-gradient( -135deg, transparent 20px, #FA8322 0)");
    			add_location(h40, file$6, 74, 10, 2141);
    			attr_dev(span0, "class", "square");
    			add_location(span0, file$6, 82, 12, 2357);
    			attr_dev(span1, "class", "status-label");
    			add_location(span1, file$6, 83, 12, 2393);
    			attr_dev(span2, "class", "bx-gsm-value");
    			add_location(span2, file$6, 85, 14, 2488);
    			attr_dev(span3, "class", "status-text");
    			add_location(span3, file$6, 84, 12, 2447);
    			attr_dev(div0, "class", "status-icon");
    			add_location(div0, file$6, 81, 10, 2319);
    			attr_dev(span4, "class", "square");
    			add_location(span4, file$6, 90, 12, 2630);
    			attr_dev(span5, "class", "status-label");
    			add_location(span5, file$6, 91, 12, 2666);
    			attr_dev(span6, "class", "by-gsm-value");
    			add_location(span6, file$6, 93, 14, 2761);
    			attr_dev(span7, "class", "status-text");
    			add_location(span7, file$6, 92, 12, 2720);
    			attr_dev(div1, "class", "status-icon");
    			add_location(div1, file$6, 89, 10, 2592);
    			attr_dev(span8, "class", "square");
    			add_location(span8, file$6, 98, 12, 2903);
    			attr_dev(span9, "class", "status-label");
    			add_location(span9, file$6, 99, 12, 2939);
    			attr_dev(span10, "class", "bz-gsm-value");
    			add_location(span10, file$6, 101, 14, 3034);
    			attr_dev(span11, "class", "status-text");
    			add_location(span11, file$6, 100, 12, 2993);
    			attr_dev(div2, "class", "status-icon");
    			add_location(div2, file$6, 97, 10, 2865);
    			attr_dev(span12, "class", "square");
    			add_location(span12, file$6, 106, 12, 3176);
    			attr_dev(span13, "class", "status-label");
    			add_location(span13, file$6, 107, 12, 3212);
    			attr_dev(span14, "class", "bt-value");
    			add_location(span14, file$6, 109, 14, 3303);
    			attr_dev(span15, "class", "status-text");
    			add_location(span15, file$6, 108, 12, 3262);
    			attr_dev(div3, "class", "status-icon");
    			add_location(div3, file$6, 105, 10, 3138);
    			attr_dev(div4, "class", "h-full p-2 grid items-center");
    			set_style(div4, "background", "linear-gradient( -135deg, transparent 20px, #161E1C 0)");
    			add_location(div4, file$6, 70, 8, 1983);
    			attr_dev(div5, "class", "w-full p-[2px]");
    			set_style(div5, "background", "linear-gradient( -135deg, transparent 20px, #ffffff4d 0)");
    			add_location(div5, file$6, 66, 6, 1845);
    			attr_dev(h41, "class", "mb-2 p-1");
    			set_style(h41, "background", "linear-gradient( -135deg, transparent 20px, #FA8322 0)");
    			add_location(h41, file$6, 123, 10, 3695);
    			attr_dev(span16, "class", "square");
    			add_location(span16, file$6, 130, 12, 3923);
    			attr_dev(span17, "class", "status-label");
    			add_location(span17, file$6, 131, 12, 3959);
    			attr_dev(span18, "class", "status-text");
    			add_location(span18, file$6, 132, 12, 4015);
    			attr_dev(div6, "class", "status-icon");
    			add_location(div6, file$6, 129, 10, 3885);
    			attr_dev(span19, "class", "square");
    			add_location(span19, file$6, 135, 12, 4134);
    			attr_dev(span20, "class", "status-label");
    			add_location(span20, file$6, 136, 12, 4170);
    			attr_dev(span21, "class", "status-text");
    			add_location(span21, file$6, 137, 12, 4227);
    			attr_dev(div7, "class", "status-icon");
    			add_location(div7, file$6, 134, 10, 4096);
    			attr_dev(span22, "class", "square");
    			add_location(span22, file$6, 140, 12, 4347);
    			attr_dev(span23, "class", "status-label");
    			add_location(span23, file$6, 141, 12, 4383);
    			attr_dev(span24, "class", "status-text");
    			add_location(span24, file$6, 142, 12, 4439);
    			attr_dev(div8, "class", "status-icon");
    			add_location(div8, file$6, 139, 10, 4309);
    			attr_dev(span25, "class", "square");
    			add_location(span25, file$6, 145, 12, 4558);
    			attr_dev(span26, "class", "status-label");
    			add_location(span26, file$6, 146, 12, 4594);
    			attr_dev(span27, "class", "status-text");
    			add_location(span27, file$6, 147, 12, 4651);
    			attr_dev(div9, "class", "status-icon");
    			add_location(div9, file$6, 144, 10, 4520);
    			attr_dev(span28, "class", "square");
    			add_location(span28, file$6, 150, 12, 4771);
    			attr_dev(span29, "class", "status-label");
    			add_location(span29, file$6, 151, 12, 4807);
    			attr_dev(span30, "class", "status-text");
    			add_location(span30, file$6, 152, 12, 4866);
    			attr_dev(div10, "class", "status-icon");
    			add_location(div10, file$6, 149, 10, 4733);
    			attr_dev(span31, "class", "square");
    			add_location(span31, file$6, 155, 12, 4988);
    			attr_dev(span32, "class", "status-label");
    			add_location(span32, file$6, 156, 12, 5024);
    			attr_dev(span33, "class", "status-text");
    			add_location(span33, file$6, 157, 12, 5083);
    			attr_dev(div11, "class", "status-icon");
    			add_location(div11, file$6, 154, 10, 4950);
    			attr_dev(span34, "class", "square");
    			add_location(span34, file$6, 160, 12, 5205);
    			attr_dev(span35, "class", "status-label");
    			add_location(span35, file$6, 161, 12, 5241);
    			attr_dev(span36, "class", "status-text");
    			add_location(span36, file$6, 162, 12, 5294);
    			attr_dev(div12, "class", "status-icon");
    			add_location(div12, file$6, 159, 10, 5167);
    			attr_dev(span37, "class", "square");
    			add_location(span37, file$6, 165, 12, 5410);
    			attr_dev(span38, "class", "status-label");
    			add_location(span38, file$6, 166, 12, 5446);
    			attr_dev(span39, "class", "status-text");
    			add_location(span39, file$6, 167, 12, 5498);
    			attr_dev(div13, "class", "status-icon");
    			add_location(div13, file$6, 164, 10, 5372);
    			attr_dev(span40, "class", "square");
    			add_location(span40, file$6, 170, 12, 5613);
    			attr_dev(span41, "class", "status-label");
    			add_location(span41, file$6, 171, 12, 5649);
    			attr_dev(span42, "class", "status-text");
    			add_location(span42, file$6, 172, 12, 5705);
    			attr_dev(div14, "class", "status-icon");
    			add_location(div14, file$6, 169, 10, 5575);
    			attr_dev(span43, "class", "square");
    			add_location(span43, file$6, 175, 12, 5824);
    			attr_dev(span44, "class", "status-label");
    			add_location(span44, file$6, 176, 12, 5860);
    			attr_dev(span45, "class", "status-text");
    			add_location(span45, file$6, 177, 12, 5918);
    			attr_dev(div15, "class", "status-icon");
    			add_location(div15, file$6, 174, 10, 5786);
    			attr_dev(div16, "class", "p-3");
    			set_style(div16, "background", "linear-gradient( -135deg, transparent 20px, #161E1C 0)");
    			add_location(div16, file$6, 119, 8, 3562);
    			attr_dev(div17, "class", "p-[2px] w-full");
    			set_style(div17, "background", "linear-gradient( -135deg, transparent 20px, #ffffff4d 0)");
    			add_location(div17, file$6, 115, 6, 3424);
    			attr_dev(div18, "class", "flex w-full space-x-5");
    			add_location(div18, file$6, 65, 4, 1803);
    			set_style(div19, "font-size", "16px");
    			attr_dev(div19, "class", "w-full mt-5 flex");
    			add_location(div19, file$6, 64, 2, 1744);
    			attr_dev(h20, "class", "text-[#FA8322] svelte-vq0qvc");
    			add_location(h20, file$6, 203, 12, 6667);
    			attr_dev(span46, "class", "bullet");
    			add_location(span46, file$6, 206, 16, 6793);
    			add_location(li0, file$6, 205, 14, 6772);
    			attr_dev(span47, "class", "bullet");
    			add_location(span47, file$6, 209, 16, 6899);
    			add_location(li1, file$6, 208, 14, 6878);
    			attr_dev(span48, "class", "bullet");
    			add_location(span48, file$6, 212, 16, 7014);
    			add_location(li2, file$6, 211, 14, 6993);
    			attr_dev(ul0, "class", "data-fields");
    			add_location(ul0, file$6, 204, 12, 6733);
    			attr_dev(div20, "class", "");
    			add_location(div20, file$6, 202, 10, 6640);
    			attr_dev(h21, "class", "svelte-vq0qvc");
    			add_location(h21, file$6, 218, 12, 7173);
    			attr_dev(span49, "class", "bullet");
    			add_location(span49, file$6, 221, 16, 7277);
    			add_location(li3, file$6, 220, 14, 7256);
    			attr_dev(span50, "class", "bullet");
    			add_location(span50, file$6, 223, 18, 7360);
    			add_location(li4, file$6, 223, 14, 7356);
    			attr_dev(ul1, "class", "data-fields");
    			add_location(ul1, file$6, 219, 12, 7217);
    			attr_dev(div21, "class", "info-item");
    			add_location(div21, file$6, 217, 10, 7137);
    			attr_dev(h22, "class", "svelte-vq0qvc");
    			add_location(h22, file$6, 228, 12, 7488);
    			attr_dev(span51, "class", "bullet");
    			add_location(span51, file$6, 231, 16, 7590);
    			add_location(li5, file$6, 230, 14, 7569);
    			attr_dev(span52, "class", "bullet");
    			add_location(span52, file$6, 234, 16, 7692);
    			add_location(li6, file$6, 233, 14, 7671);
    			attr_dev(ul2, "class", "data-fields");
    			add_location(ul2, file$6, 229, 12, 7530);
    			attr_dev(div22, "class", "info-item");
    			add_location(div22, file$6, 227, 10, 7452);
    			attr_dev(h23, "class", "svelte-vq0qvc");
    			add_location(h23, file$6, 240, 12, 7843);
    			attr_dev(span53, "class", "bullet");
    			add_location(span53, file$6, 243, 16, 7941);
    			add_location(li7, file$6, 242, 14, 7920);
    			attr_dev(span54, "class", "bullet");
    			add_location(span54, file$6, 246, 16, 8050);
    			add_location(li8, file$6, 245, 14, 8029);
    			attr_dev(ul3, "class", "data-fields");
    			add_location(ul3, file$6, 241, 12, 7881);
    			attr_dev(div23, "class", "info-item");
    			add_location(div23, file$6, 239, 10, 7807);
    			attr_dev(h24, "class", "svelte-vq0qvc");
    			add_location(h24, file$6, 252, 12, 8207);
    			attr_dev(span55, "class", "bullet");
    			add_location(span55, file$6, 255, 16, 8313);
    			add_location(li9, file$6, 254, 14, 8292);
    			attr_dev(span56, "class", "bullet");
    			add_location(span56, file$6, 258, 16, 8423);
    			add_location(li10, file$6, 257, 14, 8402);
    			attr_dev(ul4, "class", "data-fields");
    			add_location(ul4, file$6, 253, 12, 8253);
    			attr_dev(div24, "class", "info-item");
    			add_location(div24, file$6, 251, 10, 8171);
    			attr_dev(h25, "class", "svelte-vq0qvc");
    			add_location(h25, file$6, 264, 12, 8582);
    			attr_dev(span57, "class", "bullet");
    			add_location(span57, file$6, 266, 18, 8673);
    			add_location(li11, file$6, 266, 14, 8669);
    			attr_dev(span58, "class", "bullet");
    			add_location(span58, file$6, 268, 16, 8753);
    			add_location(li12, file$6, 267, 14, 8732);
    			attr_dev(ul5, "class", "data-fields");
    			add_location(ul5, file$6, 265, 12, 8630);
    			attr_dev(div25, "class", "info-item");
    			add_location(div25, file$6, 263, 10, 8546);
    			attr_dev(div26, "class", "flex space-x-10 p-2");
    			set_style(div26, "font-size", "14px");
    			set_style(div26, "background", "linear-gradient( -135deg, transparent 20px, #161E1C 0)");
    			add_location(div26, file$6, 197, 8, 6451);
    			attr_dev(div27, "class", "p-[1px]");
    			set_style(div27, "background", "linear-gradient( -135deg, transparent 20px, #ffffff4d 0)");
    			set_style(div27, "box-shadow", "0px 13px 10px -10px rgb(0, 255, 213)");
    			add_location(div27, file$6, 191, 6, 6237);
    			attr_dev(div28, "class", "mt-5");
    			add_location(div28, file$6, 189, 4, 6172);
    			attr_dev(div29, "class", "");
    			add_location(div29, file$6, 187, 2, 6125);
    			attr_dev(main, "class", "w-full");
    			add_location(main, file$6, 58, 0, 1595);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h40);
    			append_dev(div4, t3);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t4);
    			append_dev(div0, span1);
    			append_dev(div0, t6);
    			append_dev(div0, span3);
    			append_dev(span3, span2);
    			append_dev(span2, t7);
    			append_dev(div4, t8);
    			append_dev(div4, div1);
    			append_dev(div1, span4);
    			append_dev(div1, t9);
    			append_dev(div1, span5);
    			append_dev(div1, t11);
    			append_dev(div1, span7);
    			append_dev(span7, span6);
    			append_dev(span6, t12);
    			append_dev(div4, t13);
    			append_dev(div4, div2);
    			append_dev(div2, span8);
    			append_dev(div2, t14);
    			append_dev(div2, span9);
    			append_dev(div2, t16);
    			append_dev(div2, span11);
    			append_dev(span11, span10);
    			append_dev(span10, t17);
    			append_dev(div4, t18);
    			append_dev(div4, div3);
    			append_dev(div3, span12);
    			append_dev(div3, t19);
    			append_dev(div3, span13);
    			append_dev(div3, t21);
    			append_dev(div3, span15);
    			append_dev(span15, span14);
    			append_dev(span14, t22);
    			append_dev(div18, t23);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, h41);
    			append_dev(div16, t25);
    			append_dev(div16, div6);
    			append_dev(div6, span16);
    			append_dev(div6, t26);
    			append_dev(div6, span17);
    			append_dev(div6, t28);
    			append_dev(div6, span18);
    			append_dev(span18, t29);
    			append_dev(div16, t30);
    			append_dev(div16, div7);
    			append_dev(div7, span19);
    			append_dev(div7, t31);
    			append_dev(div7, span20);
    			append_dev(div7, t33);
    			append_dev(div7, span21);
    			append_dev(span21, t34);
    			append_dev(div16, t35);
    			append_dev(div16, div8);
    			append_dev(div8, span22);
    			append_dev(div8, t36);
    			append_dev(div8, span23);
    			append_dev(div8, t38);
    			append_dev(div8, span24);
    			append_dev(span24, t39);
    			append_dev(div16, t40);
    			append_dev(div16, div9);
    			append_dev(div9, span25);
    			append_dev(div9, t41);
    			append_dev(div9, span26);
    			append_dev(div9, t43);
    			append_dev(div9, span27);
    			append_dev(span27, t44);
    			append_dev(div16, t45);
    			append_dev(div16, div10);
    			append_dev(div10, span28);
    			append_dev(div10, t46);
    			append_dev(div10, span29);
    			append_dev(div10, t48);
    			append_dev(div10, span30);
    			append_dev(span30, t49);
    			append_dev(div16, t50);
    			append_dev(div16, div11);
    			append_dev(div11, span31);
    			append_dev(div11, t51);
    			append_dev(div11, span32);
    			append_dev(div11, t53);
    			append_dev(div11, span33);
    			append_dev(span33, t54);
    			append_dev(div16, t55);
    			append_dev(div16, div12);
    			append_dev(div12, span34);
    			append_dev(div12, t56);
    			append_dev(div12, span35);
    			append_dev(div12, t58);
    			append_dev(div12, span36);
    			append_dev(span36, t59);
    			append_dev(div16, t60);
    			append_dev(div16, div13);
    			append_dev(div13, span37);
    			append_dev(div13, t61);
    			append_dev(div13, span38);
    			append_dev(div13, t63);
    			append_dev(div13, span39);
    			append_dev(span39, t64);
    			append_dev(div16, t65);
    			append_dev(div16, div14);
    			append_dev(div14, span40);
    			append_dev(div14, t66);
    			append_dev(div14, span41);
    			append_dev(div14, t68);
    			append_dev(div14, span42);
    			append_dev(span42, t69);
    			append_dev(div16, t70);
    			append_dev(div16, div15);
    			append_dev(div15, span43);
    			append_dev(div15, t71);
    			append_dev(div15, span44);
    			append_dev(div15, t73);
    			append_dev(div15, span45);
    			append_dev(span45, t74);
    			append_dev(main, t75);
    			append_dev(main, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div26, div20);
    			append_dev(div20, h20);
    			append_dev(div20, t77);
    			append_dev(div20, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, span46);
    			append_dev(li0, t78);
    			append_dev(ul0, t79);
    			append_dev(ul0, li1);
    			append_dev(li1, span47);
    			append_dev(li1, t80);
    			append_dev(ul0, t81);
    			append_dev(ul0, li2);
    			append_dev(li2, span48);
    			append_dev(li2, t82);
    			append_dev(div26, t83);
    			append_dev(div26, div21);
    			append_dev(div21, h21);
    			append_dev(div21, t85);
    			append_dev(div21, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, span49);
    			append_dev(li3, t86);
    			append_dev(ul1, t87);
    			append_dev(ul1, li4);
    			append_dev(li4, span50);
    			append_dev(li4, t88);
    			append_dev(div26, t89);
    			append_dev(div26, div22);
    			append_dev(div22, h22);
    			append_dev(div22, t91);
    			append_dev(div22, ul2);
    			append_dev(ul2, li5);
    			append_dev(li5, span51);
    			append_dev(li5, t92);
    			append_dev(ul2, t93);
    			append_dev(ul2, li6);
    			append_dev(li6, span52);
    			append_dev(li6, t94);
    			append_dev(div26, t95);
    			append_dev(div26, div23);
    			append_dev(div23, h23);
    			append_dev(div23, t97);
    			append_dev(div23, ul3);
    			append_dev(ul3, li7);
    			append_dev(li7, span53);
    			append_dev(li7, t98);
    			append_dev(ul3, t99);
    			append_dev(ul3, li8);
    			append_dev(li8, span54);
    			append_dev(li8, t100);
    			append_dev(div26, t101);
    			append_dev(div26, div24);
    			append_dev(div24, h24);
    			append_dev(div24, t103);
    			append_dev(div24, ul4);
    			append_dev(ul4, li9);
    			append_dev(li9, span55);
    			append_dev(li9, t104);
    			append_dev(ul4, t105);
    			append_dev(ul4, li10);
    			append_dev(li10, span56);
    			append_dev(li10, t106);
    			append_dev(div26, t107);
    			append_dev(div26, div25);
    			append_dev(div25, h25);
    			append_dev(div25, t109);
    			append_dev(div25, ul5);
    			append_dev(ul5, li11);
    			append_dev(li11, span57);
    			append_dev(li11, t110);
    			append_dev(ul5, t111);
    			append_dev(ul5, li12);
    			append_dev(li12, span58);
    			append_dev(li12, t112);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*solarWindData*/ 2 && t7_value !== (t7_value = /*solarWindData*/ ctx[1].bxGSM + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*solarWindData*/ 2 && t12_value !== (t12_value = /*solarWindData*/ ctx[1].byGSM + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*solarWindData*/ 2 && t17_value !== (t17_value = /*solarWindData*/ ctx[1].bzGSM + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*solarWindData*/ 2 && t22_value !== (t22_value = /*solarWindData*/ ctx[1].bt + "")) set_data_dev(t22, t22_value);
    			if (dirty & /*earthData*/ 1 && t29_value !== (t29_value = /*earthData*/ ctx[0].latitude + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*earthData*/ 1 && t34_value !== (t34_value = /*earthData*/ ctx[0].longitude + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*earthData*/ 1 && t39_value !== (t39_value = /*earthData*/ ctx[0].altitude + "")) set_data_dev(t39, t39_value);
    			if (dirty & /*earthData*/ 1 && t44_value !== (t44_value = /*earthData*/ ctx[0].intensity + "")) set_data_dev(t44, t44_value);
    			if (dirty & /*earthData*/ 1 && t49_value !== (t49_value = /*earthData*/ ctx[0].declination + "")) set_data_dev(t49, t49_value);
    			if (dirty & /*earthData*/ 1 && t54_value !== (t54_value = /*earthData*/ ctx[0].inclination + "")) set_data_dev(t54, t54_value);
    			if (dirty & /*earthData*/ 1 && t59_value !== (t59_value = /*earthData*/ ctx[0].north + "")) set_data_dev(t59, t59_value);
    			if (dirty & /*earthData*/ 1 && t64_value !== (t64_value = /*earthData*/ ctx[0].east + "")) set_data_dev(t64, t64_value);
    			if (dirty & /*earthData*/ 1 && t69_value !== (t69_value = /*earthData*/ ctx[0].vertical + "")) set_data_dev(t69, t69_value);
    			if (dirty & /*earthData*/ 1 && t74_value !== (t74_value = /*earthData*/ ctx[0].horizontal + "")) set_data_dev(t74, t74_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const apiKey$3 = "1202a311-b72c-4c0c-87fb-48cd908723c1";
    const baseApiUrl$2 = "https://app-rssi-api-eastus-dev-001.azurewebsites.net";

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ace_sat', slots, []);
    	const earthApiUrl = baseApiUrl$2 + "/api/earthdata/ncei";
    	const solarWindApiUrl = baseApiUrl$2 + "/api/satellitedata/ace";
    	let earthData = {};
    	let solarWindData = {};

    	// Function to fetch Earth data from the API
    	async function fetchEarthData() {
    		console.log("Fetching solar wind data.");

    		const response = await fetch(earthApiUrl, {
    			headers: {
    				"x-api-key": `${apiKey$3}`,
    				"Content-Type": "application/json"
    			}
    		});

    		if (response.ok) {
    			$$invalidate(0, earthData = await response.json());
    		} else {
    			console.error("Failed to fetch Earth data from the API.");
    		}
    	}

    	// Function to fetch Sun data from the API
    	async function fetchSolarWindData() {
    		console.log("Fetching solar wind data from ACE.");

    		const response = await fetch(solarWindApiUrl, {
    			headers: {
    				"x-api-key": `${apiKey$3}`,
    				"Content-Type": "application/json"
    			}
    		});

    		if (response.ok) {
    			$$invalidate(1, solarWindData = await response.json());
    		} else {
    			console.error("Failed to fetch Sun data from the API.");
    		}
    	}

    	onMount(async () => {
    		// Fetch Earth and Sun data
    		// when the component is mounted
    		await fetchEarthData();

    		await fetchSolarWindData();

    		// Fetch solar wind dat every 10s
    		setInterval(fetchSolarWindData, 10000);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Ace_sat> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		apiKey: apiKey$3,
    		baseApiUrl: baseApiUrl$2,
    		earthApiUrl,
    		solarWindApiUrl,
    		earthData,
    		solarWindData,
    		fetchEarthData,
    		fetchSolarWindData
    	});

    	$$self.$inject_state = $$props => {
    		if ('earthData' in $$props) $$invalidate(0, earthData = $$props.earthData);
    		if ('solarWindData' in $$props) $$invalidate(1, solarWindData = $$props.solarWindData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [earthData, solarWindData];
    }

    class Ace_sat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ace_sat",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\routes\dis_sat.svelte generated by Svelte v3.59.2 */

    const { console: console_1$2 } = globals;
    const file$5 = "src\\routes\\dis_sat.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div19;
    	let div18;
    	let div5;
    	let div4;
    	let h40;
    	let t3;
    	let div0;
    	let span0;
    	let t4;
    	let span1;
    	let t6;
    	let span3;
    	let span2;
    	let t7_value = /*solarWindData*/ ctx[1].bxGSM + "";
    	let t7;
    	let t8;
    	let div1;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span7;
    	let span6;
    	let t12_value = /*solarWindData*/ ctx[1].byGSM + "";
    	let t12;
    	let t13;
    	let div2;
    	let span8;
    	let t14;
    	let span9;
    	let t16;
    	let span11;
    	let span10;
    	let t17_value = /*solarWindData*/ ctx[1].bzGSM + "";
    	let t17;
    	let t18;
    	let div3;
    	let span12;
    	let t19;
    	let span13;
    	let t21;
    	let span15;
    	let span14;
    	let t22_value = /*solarWindData*/ ctx[1].bt + "";
    	let t22;
    	let t23;
    	let div17;
    	let div16;
    	let h41;
    	let t25;
    	let div6;
    	let span16;
    	let t26;
    	let span17;
    	let t28;
    	let span18;
    	let t29_value = /*earthData*/ ctx[0].latitude + "";
    	let t29;
    	let t30;
    	let div7;
    	let span19;
    	let t31;
    	let span20;
    	let t33;
    	let span21;
    	let t34_value = /*earthData*/ ctx[0].longitude + "";
    	let t34;
    	let t35;
    	let div8;
    	let span22;
    	let t36;
    	let span23;
    	let t38;
    	let span24;
    	let t39_value = /*earthData*/ ctx[0].altitude + "";
    	let t39;
    	let t40;
    	let div9;
    	let span25;
    	let t41;
    	let span26;
    	let t43;
    	let span27;
    	let t44_value = /*earthData*/ ctx[0].intensity + "";
    	let t44;
    	let t45;
    	let div10;
    	let span28;
    	let t46;
    	let span29;
    	let t48;
    	let span30;
    	let t49_value = /*earthData*/ ctx[0].declination + "";
    	let t49;
    	let t50;
    	let div11;
    	let span31;
    	let t51;
    	let span32;
    	let t53;
    	let span33;
    	let t54_value = /*earthData*/ ctx[0].inclination + "";
    	let t54;
    	let t55;
    	let div12;
    	let span34;
    	let t56;
    	let span35;
    	let t58;
    	let span36;
    	let t59_value = /*earthData*/ ctx[0].north + "";
    	let t59;
    	let t60;
    	let div13;
    	let span37;
    	let t61;
    	let span38;
    	let t63;
    	let span39;
    	let t64_value = /*earthData*/ ctx[0].east + "";
    	let t64;
    	let t65;
    	let div14;
    	let span40;
    	let t66;
    	let span41;
    	let t68;
    	let span42;
    	let t69_value = /*earthData*/ ctx[0].vertical + "";
    	let t69;
    	let t70;
    	let div15;
    	let span43;
    	let t71;
    	let span44;
    	let t73;
    	let span45;
    	let t74_value = /*earthData*/ ctx[0].horizontal + "";
    	let t74;
    	let t75;
    	let div29;
    	let div28;
    	let div27;
    	let div26;
    	let div20;
    	let h20;
    	let t77;
    	let ul0;
    	let li0;
    	let span46;
    	let t78;
    	let t79;
    	let li1;
    	let span47;
    	let t80;
    	let t81;
    	let li2;
    	let span48;
    	let t82;
    	let t83;
    	let div21;
    	let h21;
    	let t85;
    	let ul1;
    	let li3;
    	let span49;
    	let t86;
    	let t87;
    	let li4;
    	let span50;
    	let t88;
    	let t89;
    	let div22;
    	let h22;
    	let t91;
    	let ul2;
    	let li5;
    	let span51;
    	let t92;
    	let t93;
    	let li6;
    	let span52;
    	let t94;
    	let t95;
    	let div23;
    	let h23;
    	let t97;
    	let ul3;
    	let li7;
    	let span53;
    	let t98;
    	let t99;
    	let li8;
    	let span54;
    	let t100;
    	let t101;
    	let div24;
    	let h24;
    	let t103;
    	let ul4;
    	let li9;
    	let span55;
    	let t104;
    	let t105;
    	let li10;
    	let span56;
    	let t106;
    	let t107;
    	let div25;
    	let h25;
    	let t109;
    	let ul5;
    	let li11;
    	let span57;
    	let t110;
    	let t111;
    	let li12;
    	let span58;
    	let t112;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "DSCOVR SATELLITE INFORMATIONS";
    			t1 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Solar wind";
    			t3 = space();
    			div0 = element("div");
    			span0 = element("span");
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "bx_gsm:";
    			t6 = space();
    			span3 = element("span");
    			span2 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			div1 = element("div");
    			span4 = element("span");
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "by_gsm:";
    			t11 = space();
    			span7 = element("span");
    			span6 = element("span");
    			t12 = text(t12_value);
    			t13 = space();
    			div2 = element("div");
    			span8 = element("span");
    			t14 = space();
    			span9 = element("span");
    			span9.textContent = "bz_gsm:";
    			t16 = space();
    			span11 = element("span");
    			span10 = element("span");
    			t17 = text(t17_value);
    			t18 = space();
    			div3 = element("div");
    			span12 = element("span");
    			t19 = space();
    			span13 = element("span");
    			span13.textContent = "bt:";
    			t21 = space();
    			span15 = element("span");
    			span14 = element("span");
    			t22 = text(t22_value);
    			t23 = space();
    			div17 = element("div");
    			div16 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Geo-magnetic field";
    			t25 = space();
    			div6 = element("div");
    			span16 = element("span");
    			t26 = space();
    			span17 = element("span");
    			span17.textContent = "Latitude:";
    			t28 = space();
    			span18 = element("span");
    			t29 = text(t29_value);
    			t30 = space();
    			div7 = element("div");
    			span19 = element("span");
    			t31 = space();
    			span20 = element("span");
    			span20.textContent = "Longitude:";
    			t33 = space();
    			span21 = element("span");
    			t34 = text(t34_value);
    			t35 = space();
    			div8 = element("div");
    			span22 = element("span");
    			t36 = space();
    			span23 = element("span");
    			span23.textContent = "Altitude:";
    			t38 = space();
    			span24 = element("span");
    			t39 = text(t39_value);
    			t40 = space();
    			div9 = element("div");
    			span25 = element("span");
    			t41 = space();
    			span26 = element("span");
    			span26.textContent = "Intensity:";
    			t43 = space();
    			span27 = element("span");
    			t44 = text(t44_value);
    			t45 = space();
    			div10 = element("div");
    			span28 = element("span");
    			t46 = space();
    			span29 = element("span");
    			span29.textContent = "Declination:";
    			t48 = space();
    			span30 = element("span");
    			t49 = text(t49_value);
    			t50 = space();
    			div11 = element("div");
    			span31 = element("span");
    			t51 = space();
    			span32 = element("span");
    			span32.textContent = "Inclination:";
    			t53 = space();
    			span33 = element("span");
    			t54 = text(t54_value);
    			t55 = space();
    			div12 = element("div");
    			span34 = element("span");
    			t56 = space();
    			span35 = element("span");
    			span35.textContent = "North:";
    			t58 = space();
    			span36 = element("span");
    			t59 = text(t59_value);
    			t60 = space();
    			div13 = element("div");
    			span37 = element("span");
    			t61 = space();
    			span38 = element("span");
    			span38.textContent = "East:";
    			t63 = space();
    			span39 = element("span");
    			t64 = text(t64_value);
    			t65 = space();
    			div14 = element("div");
    			span40 = element("span");
    			t66 = space();
    			span41 = element("span");
    			span41.textContent = "Vertical:";
    			t68 = space();
    			span42 = element("span");
    			t69 = text(t69_value);
    			t70 = space();
    			div15 = element("div");
    			span43 = element("span");
    			t71 = space();
    			span44 = element("span");
    			span44.textContent = "Horizontal:";
    			t73 = space();
    			span45 = element("span");
    			t74 = text(t74_value);
    			t75 = space();
    			div29 = element("div");
    			div28 = element("div");
    			div27 = element("div");
    			div26 = element("div");
    			div20 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Solar Wind Monitoring";
    			t77 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			span46 = element("span");
    			t78 = text(" Solar Wind Speed: 500 km/s");
    			t79 = space();
    			li1 = element("li");
    			span47 = element("span");
    			t80 = text(" Solar Wind Density: 5 particles/cm³");
    			t81 = space();
    			li2 = element("li");
    			span48 = element("span");
    			t82 = text(" Solar Wind Magnetic Field: 10 nT");
    			t83 = space();
    			div21 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Earth Radiation Budget";
    			t85 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			span49 = element("span");
    			t86 = text(" Earth's Albedo: 0.30");
    			t87 = space();
    			li4 = element("li");
    			span50 = element("span");
    			t88 = text(" Cloud Cover: 40%");
    			t89 = space();
    			div22 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Space Weather Alerts";
    			t91 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			span51 = element("span");
    			t92 = text(" Solar Flares: Moderate");
    			t93 = space();
    			li6 = element("li");
    			span52 = element("span");
    			t94 = text(" Geomagnetic Storms: None");
    			t95 = space();
    			div23 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Climate Research";
    			t97 = space();
    			ul3 = element("ul");
    			li7 = element("li");
    			span53 = element("span");
    			t98 = text(" Albedo Changes: 0.02 per year");
    			t99 = space();
    			li8 = element("li");
    			span54 = element("span");
    			t100 = text(" Cloud Cover Patterns: Variable");
    			t101 = space();
    			div24 = element("div");
    			h24 = element("h2");
    			h24.textContent = "Atmospheric Measurements";
    			t103 = space();
    			ul4 = element("ul");
    			li9 = element("li");
    			span55 = element("span");
    			t104 = text(" Ozone Levels: 300 Dobson Units");
    			t105 = space();
    			li10 = element("li");
    			span56 = element("span");
    			t106 = text(" Aerosol Concentrations: 15 µg/m³");
    			t107 = space();
    			div25 = element("div");
    			h25 = element("h2");
    			h25.textContent = "Space Environment Research";
    			t109 = space();
    			ul5 = element("ul");
    			li11 = element("li");
    			span57 = element("span");
    			t110 = text(" Auroras: Active");
    			t111 = space();
    			li12 = element("li");
    			span58 = element("span");
    			t112 = text(" Geomagnetic Disturbances: Low");
    			attr_dev(h1, "class", "mt-10 text-xs border-b border-white/30");
    			add_location(h1, file$5, 62, 2, 1664);
    			attr_dev(h40, "class", "p-2");
    			set_style(h40, "background", "linear-gradient( -135deg, transparent 20px, #FA8322 0)");
    			add_location(h40, file$5, 76, 10, 2158);
    			attr_dev(span0, "class", "square");
    			add_location(span0, file$5, 84, 12, 2374);
    			attr_dev(span1, "class", "status-label");
    			add_location(span1, file$5, 85, 12, 2410);
    			attr_dev(span2, "class", "bx-gsm-value");
    			add_location(span2, file$5, 87, 14, 2505);
    			attr_dev(span3, "class", "status-text");
    			add_location(span3, file$5, 86, 12, 2464);
    			attr_dev(div0, "class", "status-icon");
    			add_location(div0, file$5, 83, 10, 2336);
    			attr_dev(span4, "class", "square");
    			add_location(span4, file$5, 92, 12, 2647);
    			attr_dev(span5, "class", "status-label");
    			add_location(span5, file$5, 93, 12, 2683);
    			attr_dev(span6, "class", "by-gsm-value");
    			add_location(span6, file$5, 95, 14, 2778);
    			attr_dev(span7, "class", "status-text");
    			add_location(span7, file$5, 94, 12, 2737);
    			attr_dev(div1, "class", "status-icon");
    			add_location(div1, file$5, 91, 10, 2609);
    			attr_dev(span8, "class", "square");
    			add_location(span8, file$5, 100, 12, 2920);
    			attr_dev(span9, "class", "status-label");
    			add_location(span9, file$5, 101, 12, 2956);
    			attr_dev(span10, "class", "bz-gsm-value");
    			add_location(span10, file$5, 103, 14, 3051);
    			attr_dev(span11, "class", "status-text");
    			add_location(span11, file$5, 102, 12, 3010);
    			attr_dev(div2, "class", "status-icon");
    			add_location(div2, file$5, 99, 10, 2882);
    			attr_dev(span12, "class", "square");
    			add_location(span12, file$5, 108, 12, 3193);
    			attr_dev(span13, "class", "status-label");
    			add_location(span13, file$5, 109, 12, 3229);
    			attr_dev(span14, "class", "bt-value");
    			add_location(span14, file$5, 111, 14, 3320);
    			attr_dev(span15, "class", "status-text");
    			add_location(span15, file$5, 110, 12, 3279);
    			attr_dev(div3, "class", "status-icon");
    			add_location(div3, file$5, 107, 10, 3155);
    			attr_dev(div4, "class", "h-full p-2 grid items-center");
    			set_style(div4, "background", "linear-gradient( -135deg, transparent 20px, #161E1C 0)");
    			add_location(div4, file$5, 72, 8, 2000);
    			attr_dev(div5, "class", "w-full p-[2px]");
    			set_style(div5, "background", "linear-gradient( -135deg, transparent 20px, #ffffff4d 0)");
    			add_location(div5, file$5, 68, 6, 1862);
    			attr_dev(h41, "class", "mb-2 p-1");
    			set_style(h41, "background", "linear-gradient( -135deg, transparent 20px, #FA8322 0)");
    			add_location(h41, file$5, 125, 10, 3712);
    			attr_dev(span16, "class", "square");
    			add_location(span16, file$5, 132, 12, 3940);
    			attr_dev(span17, "class", "status-label");
    			add_location(span17, file$5, 133, 12, 3976);
    			attr_dev(span18, "class", "status-text");
    			add_location(span18, file$5, 134, 12, 4032);
    			attr_dev(div6, "class", "status-icon");
    			add_location(div6, file$5, 131, 10, 3902);
    			attr_dev(span19, "class", "square");
    			add_location(span19, file$5, 137, 12, 4151);
    			attr_dev(span20, "class", "status-label");
    			add_location(span20, file$5, 138, 12, 4187);
    			attr_dev(span21, "class", "status-text");
    			add_location(span21, file$5, 139, 12, 4244);
    			attr_dev(div7, "class", "status-icon");
    			add_location(div7, file$5, 136, 10, 4113);
    			attr_dev(span22, "class", "square");
    			add_location(span22, file$5, 142, 12, 4364);
    			attr_dev(span23, "class", "status-label");
    			add_location(span23, file$5, 143, 12, 4400);
    			attr_dev(span24, "class", "status-text");
    			add_location(span24, file$5, 144, 12, 4456);
    			attr_dev(div8, "class", "status-icon");
    			add_location(div8, file$5, 141, 10, 4326);
    			attr_dev(span25, "class", "square");
    			add_location(span25, file$5, 147, 12, 4575);
    			attr_dev(span26, "class", "status-label");
    			add_location(span26, file$5, 148, 12, 4611);
    			attr_dev(span27, "class", "status-text");
    			add_location(span27, file$5, 149, 12, 4668);
    			attr_dev(div9, "class", "status-icon");
    			add_location(div9, file$5, 146, 10, 4537);
    			attr_dev(span28, "class", "square");
    			add_location(span28, file$5, 152, 12, 4788);
    			attr_dev(span29, "class", "status-label");
    			add_location(span29, file$5, 153, 12, 4824);
    			attr_dev(span30, "class", "status-text");
    			add_location(span30, file$5, 154, 12, 4883);
    			attr_dev(div10, "class", "status-icon");
    			add_location(div10, file$5, 151, 10, 4750);
    			attr_dev(span31, "class", "square");
    			add_location(span31, file$5, 157, 12, 5005);
    			attr_dev(span32, "class", "status-label");
    			add_location(span32, file$5, 158, 12, 5041);
    			attr_dev(span33, "class", "status-text");
    			add_location(span33, file$5, 159, 12, 5100);
    			attr_dev(div11, "class", "status-icon");
    			add_location(div11, file$5, 156, 10, 4967);
    			attr_dev(span34, "class", "square");
    			add_location(span34, file$5, 162, 12, 5222);
    			attr_dev(span35, "class", "status-label");
    			add_location(span35, file$5, 163, 12, 5258);
    			attr_dev(span36, "class", "status-text");
    			add_location(span36, file$5, 164, 12, 5311);
    			attr_dev(div12, "class", "status-icon");
    			add_location(div12, file$5, 161, 10, 5184);
    			attr_dev(span37, "class", "square");
    			add_location(span37, file$5, 167, 12, 5427);
    			attr_dev(span38, "class", "status-label");
    			add_location(span38, file$5, 168, 12, 5463);
    			attr_dev(span39, "class", "status-text");
    			add_location(span39, file$5, 169, 12, 5515);
    			attr_dev(div13, "class", "status-icon");
    			add_location(div13, file$5, 166, 10, 5389);
    			attr_dev(span40, "class", "square");
    			add_location(span40, file$5, 172, 12, 5630);
    			attr_dev(span41, "class", "status-label");
    			add_location(span41, file$5, 173, 12, 5666);
    			attr_dev(span42, "class", "status-text");
    			add_location(span42, file$5, 174, 12, 5722);
    			attr_dev(div14, "class", "status-icon");
    			add_location(div14, file$5, 171, 10, 5592);
    			attr_dev(span43, "class", "square");
    			add_location(span43, file$5, 177, 12, 5841);
    			attr_dev(span44, "class", "status-label");
    			add_location(span44, file$5, 178, 12, 5877);
    			attr_dev(span45, "class", "status-text");
    			add_location(span45, file$5, 179, 12, 5935);
    			attr_dev(div15, "class", "status-icon");
    			add_location(div15, file$5, 176, 10, 5803);
    			attr_dev(div16, "class", "p-3");
    			set_style(div16, "background", "linear-gradient( -135deg, transparent 20px, #161E1C 0)");
    			add_location(div16, file$5, 121, 8, 3579);
    			attr_dev(div17, "class", "w-full p-[2px]");
    			set_style(div17, "background", "linear-gradient( -135deg, transparent 20px, #ffffff4d 0)");
    			add_location(div17, file$5, 117, 6, 3441);
    			attr_dev(div18, "class", "flex w-full space-x-5");
    			add_location(div18, file$5, 67, 4, 1820);
    			set_style(div19, "font-size", "16px");
    			attr_dev(div19, "class", "w-full mt-5 flex");
    			add_location(div19, file$5, 66, 2, 1761);
    			attr_dev(h20, "class", "svelte-6rwxnv");
    			add_location(h20, file$5, 205, 12, 6690);
    			attr_dev(span46, "class", "bullet");
    			add_location(span46, file$5, 208, 16, 6793);
    			add_location(li0, file$5, 207, 14, 6772);
    			attr_dev(span47, "class", "bullet");
    			add_location(span47, file$5, 211, 16, 6899);
    			add_location(li1, file$5, 210, 14, 6878);
    			attr_dev(span48, "class", "bullet");
    			add_location(span48, file$5, 214, 16, 7014);
    			add_location(li2, file$5, 213, 14, 6993);
    			attr_dev(ul0, "class", "data-fields");
    			add_location(ul0, file$5, 206, 12, 6733);
    			attr_dev(div20, "class", "info-item");
    			add_location(div20, file$5, 204, 10, 6654);
    			attr_dev(h21, "class", "svelte-6rwxnv");
    			add_location(h21, file$5, 220, 12, 7173);
    			attr_dev(span49, "class", "bullet");
    			add_location(span49, file$5, 223, 16, 7277);
    			add_location(li3, file$5, 222, 14, 7256);
    			attr_dev(span50, "class", "bullet");
    			add_location(span50, file$5, 225, 18, 7360);
    			add_location(li4, file$5, 225, 14, 7356);
    			attr_dev(ul1, "class", "data-fields");
    			add_location(ul1, file$5, 221, 12, 7217);
    			attr_dev(div21, "class", "info-item");
    			add_location(div21, file$5, 219, 10, 7137);
    			attr_dev(h22, "class", "svelte-6rwxnv");
    			add_location(h22, file$5, 230, 12, 7488);
    			attr_dev(span51, "class", "bullet");
    			add_location(span51, file$5, 233, 16, 7590);
    			add_location(li5, file$5, 232, 14, 7569);
    			attr_dev(span52, "class", "bullet");
    			add_location(span52, file$5, 236, 16, 7692);
    			add_location(li6, file$5, 235, 14, 7671);
    			attr_dev(ul2, "class", "data-fields");
    			add_location(ul2, file$5, 231, 12, 7530);
    			attr_dev(div22, "class", "info-item");
    			add_location(div22, file$5, 229, 10, 7452);
    			attr_dev(h23, "class", "svelte-6rwxnv");
    			add_location(h23, file$5, 242, 12, 7843);
    			attr_dev(span53, "class", "bullet");
    			add_location(span53, file$5, 245, 16, 7941);
    			add_location(li7, file$5, 244, 14, 7920);
    			attr_dev(span54, "class", "bullet");
    			add_location(span54, file$5, 248, 16, 8050);
    			add_location(li8, file$5, 247, 14, 8029);
    			attr_dev(ul3, "class", "data-fields");
    			add_location(ul3, file$5, 243, 12, 7881);
    			attr_dev(div23, "class", "info-item");
    			add_location(div23, file$5, 241, 10, 7807);
    			attr_dev(h24, "class", "svelte-6rwxnv");
    			add_location(h24, file$5, 254, 12, 8207);
    			attr_dev(span55, "class", "bullet");
    			add_location(span55, file$5, 257, 16, 8313);
    			add_location(li9, file$5, 256, 14, 8292);
    			attr_dev(span56, "class", "bullet");
    			add_location(span56, file$5, 260, 16, 8423);
    			add_location(li10, file$5, 259, 14, 8402);
    			attr_dev(ul4, "class", "data-fields");
    			add_location(ul4, file$5, 255, 12, 8253);
    			attr_dev(div24, "class", "info-item");
    			add_location(div24, file$5, 253, 10, 8171);
    			attr_dev(h25, "class", "svelte-6rwxnv");
    			add_location(h25, file$5, 266, 12, 8582);
    			attr_dev(span57, "class", "bullet");
    			add_location(span57, file$5, 268, 18, 8673);
    			add_location(li11, file$5, 268, 14, 8669);
    			attr_dev(span58, "class", "bullet");
    			add_location(span58, file$5, 270, 16, 8753);
    			add_location(li12, file$5, 269, 14, 8732);
    			attr_dev(ul5, "class", "data-fields");
    			add_location(ul5, file$5, 267, 12, 8630);
    			attr_dev(div25, "class", "info-item");
    			add_location(div25, file$5, 265, 10, 8546);
    			attr_dev(div26, "class", "flex space-x-10 p-2");
    			set_style(div26, "font-size", "14px");
    			set_style(div26, "background", "linear-gradient( -135deg, transparent 20px, #161E1C 0)");
    			add_location(div26, file$5, 199, 8, 6467);
    			attr_dev(div27, "class", "p-[1px]");
    			set_style(div27, "background", "linear-gradient( -135deg, transparent 20px, #ffffff4d 0)");
    			set_style(div27, "box-shadow", "0px 13px 10px -10px rgb(0, 255, 213)");
    			add_location(div27, file$5, 193, 6, 6253);
    			attr_dev(div28, "class", "mt-5");
    			add_location(div28, file$5, 191, 4, 6189);
    			attr_dev(div29, "class", "");
    			add_location(div29, file$5, 189, 2, 6142);
    			attr_dev(main, "class", "w-full");
    			add_location(main, file$5, 58, 0, 1595);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h40);
    			append_dev(div4, t3);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t4);
    			append_dev(div0, span1);
    			append_dev(div0, t6);
    			append_dev(div0, span3);
    			append_dev(span3, span2);
    			append_dev(span2, t7);
    			append_dev(div4, t8);
    			append_dev(div4, div1);
    			append_dev(div1, span4);
    			append_dev(div1, t9);
    			append_dev(div1, span5);
    			append_dev(div1, t11);
    			append_dev(div1, span7);
    			append_dev(span7, span6);
    			append_dev(span6, t12);
    			append_dev(div4, t13);
    			append_dev(div4, div2);
    			append_dev(div2, span8);
    			append_dev(div2, t14);
    			append_dev(div2, span9);
    			append_dev(div2, t16);
    			append_dev(div2, span11);
    			append_dev(span11, span10);
    			append_dev(span10, t17);
    			append_dev(div4, t18);
    			append_dev(div4, div3);
    			append_dev(div3, span12);
    			append_dev(div3, t19);
    			append_dev(div3, span13);
    			append_dev(div3, t21);
    			append_dev(div3, span15);
    			append_dev(span15, span14);
    			append_dev(span14, t22);
    			append_dev(div18, t23);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, h41);
    			append_dev(div16, t25);
    			append_dev(div16, div6);
    			append_dev(div6, span16);
    			append_dev(div6, t26);
    			append_dev(div6, span17);
    			append_dev(div6, t28);
    			append_dev(div6, span18);
    			append_dev(span18, t29);
    			append_dev(div16, t30);
    			append_dev(div16, div7);
    			append_dev(div7, span19);
    			append_dev(div7, t31);
    			append_dev(div7, span20);
    			append_dev(div7, t33);
    			append_dev(div7, span21);
    			append_dev(span21, t34);
    			append_dev(div16, t35);
    			append_dev(div16, div8);
    			append_dev(div8, span22);
    			append_dev(div8, t36);
    			append_dev(div8, span23);
    			append_dev(div8, t38);
    			append_dev(div8, span24);
    			append_dev(span24, t39);
    			append_dev(div16, t40);
    			append_dev(div16, div9);
    			append_dev(div9, span25);
    			append_dev(div9, t41);
    			append_dev(div9, span26);
    			append_dev(div9, t43);
    			append_dev(div9, span27);
    			append_dev(span27, t44);
    			append_dev(div16, t45);
    			append_dev(div16, div10);
    			append_dev(div10, span28);
    			append_dev(div10, t46);
    			append_dev(div10, span29);
    			append_dev(div10, t48);
    			append_dev(div10, span30);
    			append_dev(span30, t49);
    			append_dev(div16, t50);
    			append_dev(div16, div11);
    			append_dev(div11, span31);
    			append_dev(div11, t51);
    			append_dev(div11, span32);
    			append_dev(div11, t53);
    			append_dev(div11, span33);
    			append_dev(span33, t54);
    			append_dev(div16, t55);
    			append_dev(div16, div12);
    			append_dev(div12, span34);
    			append_dev(div12, t56);
    			append_dev(div12, span35);
    			append_dev(div12, t58);
    			append_dev(div12, span36);
    			append_dev(span36, t59);
    			append_dev(div16, t60);
    			append_dev(div16, div13);
    			append_dev(div13, span37);
    			append_dev(div13, t61);
    			append_dev(div13, span38);
    			append_dev(div13, t63);
    			append_dev(div13, span39);
    			append_dev(span39, t64);
    			append_dev(div16, t65);
    			append_dev(div16, div14);
    			append_dev(div14, span40);
    			append_dev(div14, t66);
    			append_dev(div14, span41);
    			append_dev(div14, t68);
    			append_dev(div14, span42);
    			append_dev(span42, t69);
    			append_dev(div16, t70);
    			append_dev(div16, div15);
    			append_dev(div15, span43);
    			append_dev(div15, t71);
    			append_dev(div15, span44);
    			append_dev(div15, t73);
    			append_dev(div15, span45);
    			append_dev(span45, t74);
    			append_dev(main, t75);
    			append_dev(main, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div26, div20);
    			append_dev(div20, h20);
    			append_dev(div20, t77);
    			append_dev(div20, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, span46);
    			append_dev(li0, t78);
    			append_dev(ul0, t79);
    			append_dev(ul0, li1);
    			append_dev(li1, span47);
    			append_dev(li1, t80);
    			append_dev(ul0, t81);
    			append_dev(ul0, li2);
    			append_dev(li2, span48);
    			append_dev(li2, t82);
    			append_dev(div26, t83);
    			append_dev(div26, div21);
    			append_dev(div21, h21);
    			append_dev(div21, t85);
    			append_dev(div21, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, span49);
    			append_dev(li3, t86);
    			append_dev(ul1, t87);
    			append_dev(ul1, li4);
    			append_dev(li4, span50);
    			append_dev(li4, t88);
    			append_dev(div26, t89);
    			append_dev(div26, div22);
    			append_dev(div22, h22);
    			append_dev(div22, t91);
    			append_dev(div22, ul2);
    			append_dev(ul2, li5);
    			append_dev(li5, span51);
    			append_dev(li5, t92);
    			append_dev(ul2, t93);
    			append_dev(ul2, li6);
    			append_dev(li6, span52);
    			append_dev(li6, t94);
    			append_dev(div26, t95);
    			append_dev(div26, div23);
    			append_dev(div23, h23);
    			append_dev(div23, t97);
    			append_dev(div23, ul3);
    			append_dev(ul3, li7);
    			append_dev(li7, span53);
    			append_dev(li7, t98);
    			append_dev(ul3, t99);
    			append_dev(ul3, li8);
    			append_dev(li8, span54);
    			append_dev(li8, t100);
    			append_dev(div26, t101);
    			append_dev(div26, div24);
    			append_dev(div24, h24);
    			append_dev(div24, t103);
    			append_dev(div24, ul4);
    			append_dev(ul4, li9);
    			append_dev(li9, span55);
    			append_dev(li9, t104);
    			append_dev(ul4, t105);
    			append_dev(ul4, li10);
    			append_dev(li10, span56);
    			append_dev(li10, t106);
    			append_dev(div26, t107);
    			append_dev(div26, div25);
    			append_dev(div25, h25);
    			append_dev(div25, t109);
    			append_dev(div25, ul5);
    			append_dev(ul5, li11);
    			append_dev(li11, span57);
    			append_dev(li11, t110);
    			append_dev(ul5, t111);
    			append_dev(ul5, li12);
    			append_dev(li12, span58);
    			append_dev(li12, t112);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*solarWindData*/ 2 && t7_value !== (t7_value = /*solarWindData*/ ctx[1].bxGSM + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*solarWindData*/ 2 && t12_value !== (t12_value = /*solarWindData*/ ctx[1].byGSM + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*solarWindData*/ 2 && t17_value !== (t17_value = /*solarWindData*/ ctx[1].bzGSM + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*solarWindData*/ 2 && t22_value !== (t22_value = /*solarWindData*/ ctx[1].bt + "")) set_data_dev(t22, t22_value);
    			if (dirty & /*earthData*/ 1 && t29_value !== (t29_value = /*earthData*/ ctx[0].latitude + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*earthData*/ 1 && t34_value !== (t34_value = /*earthData*/ ctx[0].longitude + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*earthData*/ 1 && t39_value !== (t39_value = /*earthData*/ ctx[0].altitude + "")) set_data_dev(t39, t39_value);
    			if (dirty & /*earthData*/ 1 && t44_value !== (t44_value = /*earthData*/ ctx[0].intensity + "")) set_data_dev(t44, t44_value);
    			if (dirty & /*earthData*/ 1 && t49_value !== (t49_value = /*earthData*/ ctx[0].declination + "")) set_data_dev(t49, t49_value);
    			if (dirty & /*earthData*/ 1 && t54_value !== (t54_value = /*earthData*/ ctx[0].inclination + "")) set_data_dev(t54, t54_value);
    			if (dirty & /*earthData*/ 1 && t59_value !== (t59_value = /*earthData*/ ctx[0].north + "")) set_data_dev(t59, t59_value);
    			if (dirty & /*earthData*/ 1 && t64_value !== (t64_value = /*earthData*/ ctx[0].east + "")) set_data_dev(t64, t64_value);
    			if (dirty & /*earthData*/ 1 && t69_value !== (t69_value = /*earthData*/ ctx[0].vertical + "")) set_data_dev(t69, t69_value);
    			if (dirty & /*earthData*/ 1 && t74_value !== (t74_value = /*earthData*/ ctx[0].horizontal + "")) set_data_dev(t74, t74_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const apiKey$2 = "1202a311-b72c-4c0c-87fb-48cd908723c1";
    const baseApiUrl$1 = "https://app-rssi-api-eastus-dev-001.azurewebsites.net";

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dis_sat', slots, []);
    	const earthApiUrl = baseApiUrl$1 + "/api/earthdata/ncei";
    	const solarWindApiUrl = baseApiUrl$1 + "/api/satellitedata/dscovr";
    	let earthData = {};
    	let solarWindData = {};

    	// Function to fetch Earth data from the API
    	async function fetchEarthData() {
    		console.log("Fetching geo-magnetic data.");

    		const response = await fetch(earthApiUrl, {
    			headers: {
    				"x-api-key": `${apiKey$2}`,
    				"Content-Type": "application/json"
    			}
    		});

    		if (response.ok) {
    			$$invalidate(0, earthData = await response.json());
    		} else {
    			console.error("Failed to fetch Earth data from the API.");
    		}
    	}

    	// Function to fetch Sun data from the API
    	async function fetchSolarWindData() {
    		console.log("Fetching solar wind data from DSCOVR.");

    		const response = await fetch(solarWindApiUrl, {
    			headers: {
    				"x-api-key": apiKey$2,
    				"Content-Type": "application/json"
    			}
    		});

    		if (response.ok) {
    			$$invalidate(1, solarWindData = await response.json());
    		} else {
    			console.error("Failed to fetch Sun data from the API.");
    		}
    	}

    	onMount(async () => {
    		// Fetch Earth and Sun data
    		// when the component is mounted
    		await fetchEarthData();

    		await fetchSolarWindData();

    		// fetch dscovr data every 10s
    		setInterval(fetchSolarWindData, 10000);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Dis_sat> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		apiKey: apiKey$2,
    		baseApiUrl: baseApiUrl$1,
    		earthApiUrl,
    		solarWindApiUrl,
    		earthData,
    		solarWindData,
    		fetchEarthData,
    		fetchSolarWindData
    	});

    	$$self.$inject_state = $$props => {
    		if ('earthData' in $$props) $$invalidate(0, earthData = $$props.earthData);
    		if ('solarWindData' in $$props) $$invalidate(1, solarWindData = $$props.solarWindData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [earthData, solarWindData];
    }

    class Dis_sat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dis_sat",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /*!
     * @kurkle/color v0.3.2
     * https://github.com/kurkle/color#readme
     * (c) 2023 Jukka Kurkela
     * Released under the MIT License
     */
    function round(v) {
      return v + 0.5 | 0;
    }
    const lim = (v, l, h) => Math.max(Math.min(v, h), l);
    function p2b(v) {
      return lim(round(v * 2.55), 0, 255);
    }
    function n2b(v) {
      return lim(round(v * 255), 0, 255);
    }
    function b2n(v) {
      return lim(round(v / 2.55) / 100, 0, 1);
    }
    function n2p(v) {
      return lim(round(v * 100), 0, 100);
    }

    const map$1 = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15};
    const hex = [...'0123456789ABCDEF'];
    const h1 = b => hex[b & 0xF];
    const h2 = b => hex[(b & 0xF0) >> 4] + hex[b & 0xF];
    const eq = b => ((b & 0xF0) >> 4) === (b & 0xF);
    const isShort = v => eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
    function hexParse(str) {
      var len = str.length;
      var ret;
      if (str[0] === '#') {
        if (len === 4 || len === 5) {
          ret = {
            r: 255 & map$1[str[1]] * 17,
            g: 255 & map$1[str[2]] * 17,
            b: 255 & map$1[str[3]] * 17,
            a: len === 5 ? map$1[str[4]] * 17 : 255
          };
        } else if (len === 7 || len === 9) {
          ret = {
            r: map$1[str[1]] << 4 | map$1[str[2]],
            g: map$1[str[3]] << 4 | map$1[str[4]],
            b: map$1[str[5]] << 4 | map$1[str[6]],
            a: len === 9 ? (map$1[str[7]] << 4 | map$1[str[8]]) : 255
          };
        }
      }
      return ret;
    }
    const alpha = (a, f) => a < 255 ? f(a) : '';
    function hexString(v) {
      var f = isShort(v) ? h1 : h2;
      return v
        ? '#' + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f)
        : undefined;
    }

    const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
    function hsl2rgbn(h, s, l) {
      const a = s * Math.min(l, 1 - l);
      const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return [f(0), f(8), f(4)];
    }
    function hsv2rgbn(h, s, v) {
      const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
      return [f(5), f(3), f(1)];
    }
    function hwb2rgbn(h, w, b) {
      const rgb = hsl2rgbn(h, 1, 0.5);
      let i;
      if (w + b > 1) {
        i = 1 / (w + b);
        w *= i;
        b *= i;
      }
      for (i = 0; i < 3; i++) {
        rgb[i] *= 1 - w - b;
        rgb[i] += w;
      }
      return rgb;
    }
    function hueValue(r, g, b, d, max) {
      if (r === max) {
        return ((g - b) / d) + (g < b ? 6 : 0);
      }
      if (g === max) {
        return (b - r) / d + 2;
      }
      return (r - g) / d + 4;
    }
    function rgb2hsl(v) {
      const range = 255;
      const r = v.r / range;
      const g = v.g / range;
      const b = v.b / range;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      let h, s, d;
      if (max !== min) {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = hueValue(r, g, b, d, max);
        h = h * 60 + 0.5;
      }
      return [h | 0, s || 0, l];
    }
    function calln(f, a, b, c) {
      return (
        Array.isArray(a)
          ? f(a[0], a[1], a[2])
          : f(a, b, c)
      ).map(n2b);
    }
    function hsl2rgb(h, s, l) {
      return calln(hsl2rgbn, h, s, l);
    }
    function hwb2rgb(h, w, b) {
      return calln(hwb2rgbn, h, w, b);
    }
    function hsv2rgb(h, s, v) {
      return calln(hsv2rgbn, h, s, v);
    }
    function hue(h) {
      return (h % 360 + 360) % 360;
    }
    function hueParse(str) {
      const m = HUE_RE.exec(str);
      let a = 255;
      let v;
      if (!m) {
        return;
      }
      if (m[5] !== v) {
        a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
      }
      const h = hue(+m[2]);
      const p1 = +m[3] / 100;
      const p2 = +m[4] / 100;
      if (m[1] === 'hwb') {
        v = hwb2rgb(h, p1, p2);
      } else if (m[1] === 'hsv') {
        v = hsv2rgb(h, p1, p2);
      } else {
        v = hsl2rgb(h, p1, p2);
      }
      return {
        r: v[0],
        g: v[1],
        b: v[2],
        a: a
      };
    }
    function rotate(v, deg) {
      var h = rgb2hsl(v);
      h[0] = hue(h[0] + deg);
      h = hsl2rgb(h);
      v.r = h[0];
      v.g = h[1];
      v.b = h[2];
    }
    function hslString(v) {
      if (!v) {
        return;
      }
      const a = rgb2hsl(v);
      const h = a[0];
      const s = n2p(a[1]);
      const l = n2p(a[2]);
      return v.a < 255
        ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})`
        : `hsl(${h}, ${s}%, ${l}%)`;
    }

    const map$2 = {
      x: 'dark',
      Z: 'light',
      Y: 're',
      X: 'blu',
      W: 'gr',
      V: 'medium',
      U: 'slate',
      A: 'ee',
      T: 'ol',
      S: 'or',
      B: 'ra',
      C: 'lateg',
      D: 'ights',
      R: 'in',
      Q: 'turquois',
      E: 'hi',
      P: 'ro',
      O: 'al',
      N: 'le',
      M: 'de',
      L: 'yello',
      F: 'en',
      K: 'ch',
      G: 'arks',
      H: 'ea',
      I: 'ightg',
      J: 'wh'
    };
    const names$1 = {
      OiceXe: 'f0f8ff',
      antiquewEte: 'faebd7',
      aqua: 'ffff',
      aquamarRe: '7fffd4',
      azuY: 'f0ffff',
      beige: 'f5f5dc',
      bisque: 'ffe4c4',
      black: '0',
      blanKedOmond: 'ffebcd',
      Xe: 'ff',
      XeviTet: '8a2be2',
      bPwn: 'a52a2a',
      burlywood: 'deb887',
      caMtXe: '5f9ea0',
      KartYuse: '7fff00',
      KocTate: 'd2691e',
      cSO: 'ff7f50',
      cSnflowerXe: '6495ed',
      cSnsilk: 'fff8dc',
      crimson: 'dc143c',
      cyan: 'ffff',
      xXe: '8b',
      xcyan: '8b8b',
      xgTMnPd: 'b8860b',
      xWay: 'a9a9a9',
      xgYF: '6400',
      xgYy: 'a9a9a9',
      xkhaki: 'bdb76b',
      xmagFta: '8b008b',
      xTivegYF: '556b2f',
      xSange: 'ff8c00',
      xScEd: '9932cc',
      xYd: '8b0000',
      xsOmon: 'e9967a',
      xsHgYF: '8fbc8f',
      xUXe: '483d8b',
      xUWay: '2f4f4f',
      xUgYy: '2f4f4f',
      xQe: 'ced1',
      xviTet: '9400d3',
      dAppRk: 'ff1493',
      dApskyXe: 'bfff',
      dimWay: '696969',
      dimgYy: '696969',
      dodgerXe: '1e90ff',
      fiYbrick: 'b22222',
      flSOwEte: 'fffaf0',
      foYstWAn: '228b22',
      fuKsia: 'ff00ff',
      gaRsbSo: 'dcdcdc',
      ghostwEte: 'f8f8ff',
      gTd: 'ffd700',
      gTMnPd: 'daa520',
      Way: '808080',
      gYF: '8000',
      gYFLw: 'adff2f',
      gYy: '808080',
      honeyMw: 'f0fff0',
      hotpRk: 'ff69b4',
      RdianYd: 'cd5c5c',
      Rdigo: '4b0082',
      ivSy: 'fffff0',
      khaki: 'f0e68c',
      lavFMr: 'e6e6fa',
      lavFMrXsh: 'fff0f5',
      lawngYF: '7cfc00',
      NmoncEffon: 'fffacd',
      ZXe: 'add8e6',
      ZcSO: 'f08080',
      Zcyan: 'e0ffff',
      ZgTMnPdLw: 'fafad2',
      ZWay: 'd3d3d3',
      ZgYF: '90ee90',
      ZgYy: 'd3d3d3',
      ZpRk: 'ffb6c1',
      ZsOmon: 'ffa07a',
      ZsHgYF: '20b2aa',
      ZskyXe: '87cefa',
      ZUWay: '778899',
      ZUgYy: '778899',
      ZstAlXe: 'b0c4de',
      ZLw: 'ffffe0',
      lime: 'ff00',
      limegYF: '32cd32',
      lRF: 'faf0e6',
      magFta: 'ff00ff',
      maPon: '800000',
      VaquamarRe: '66cdaa',
      VXe: 'cd',
      VScEd: 'ba55d3',
      VpurpN: '9370db',
      VsHgYF: '3cb371',
      VUXe: '7b68ee',
      VsprRggYF: 'fa9a',
      VQe: '48d1cc',
      VviTetYd: 'c71585',
      midnightXe: '191970',
      mRtcYam: 'f5fffa',
      mistyPse: 'ffe4e1',
      moccasR: 'ffe4b5',
      navajowEte: 'ffdead',
      navy: '80',
      Tdlace: 'fdf5e6',
      Tive: '808000',
      TivedBb: '6b8e23',
      Sange: 'ffa500',
      SangeYd: 'ff4500',
      ScEd: 'da70d6',
      pOegTMnPd: 'eee8aa',
      pOegYF: '98fb98',
      pOeQe: 'afeeee',
      pOeviTetYd: 'db7093',
      papayawEp: 'ffefd5',
      pHKpuff: 'ffdab9',
      peru: 'cd853f',
      pRk: 'ffc0cb',
      plum: 'dda0dd',
      powMrXe: 'b0e0e6',
      purpN: '800080',
      YbeccapurpN: '663399',
      Yd: 'ff0000',
      Psybrown: 'bc8f8f',
      PyOXe: '4169e1',
      saddNbPwn: '8b4513',
      sOmon: 'fa8072',
      sandybPwn: 'f4a460',
      sHgYF: '2e8b57',
      sHshell: 'fff5ee',
      siFna: 'a0522d',
      silver: 'c0c0c0',
      skyXe: '87ceeb',
      UXe: '6a5acd',
      UWay: '708090',
      UgYy: '708090',
      snow: 'fffafa',
      sprRggYF: 'ff7f',
      stAlXe: '4682b4',
      tan: 'd2b48c',
      teO: '8080',
      tEstN: 'd8bfd8',
      tomato: 'ff6347',
      Qe: '40e0d0',
      viTet: 'ee82ee',
      JHt: 'f5deb3',
      wEte: 'ffffff',
      wEtesmoke: 'f5f5f5',
      Lw: 'ffff00',
      LwgYF: '9acd32'
    };
    function unpack() {
      const unpacked = {};
      const keys = Object.keys(names$1);
      const tkeys = Object.keys(map$2);
      let i, j, k, ok, nk;
      for (i = 0; i < keys.length; i++) {
        ok = nk = keys[i];
        for (j = 0; j < tkeys.length; j++) {
          k = tkeys[j];
          nk = nk.replace(k, map$2[k]);
        }
        k = parseInt(names$1[ok], 16);
        unpacked[nk] = [k >> 16 & 0xFF, k >> 8 & 0xFF, k & 0xFF];
      }
      return unpacked;
    }

    let names;
    function nameParse(str) {
      if (!names) {
        names = unpack();
        names.transparent = [0, 0, 0, 0];
      }
      const a = names[str.toLowerCase()];
      return a && {
        r: a[0],
        g: a[1],
        b: a[2],
        a: a.length === 4 ? a[3] : 255
      };
    }

    const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
    function rgbParse(str) {
      const m = RGB_RE.exec(str);
      let a = 255;
      let r, g, b;
      if (!m) {
        return;
      }
      if (m[7] !== r) {
        const v = +m[7];
        a = m[8] ? p2b(v) : lim(v * 255, 0, 255);
      }
      r = +m[1];
      g = +m[3];
      b = +m[5];
      r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255));
      g = 255 & (m[4] ? p2b(g) : lim(g, 0, 255));
      b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255));
      return {
        r: r,
        g: g,
        b: b,
        a: a
      };
    }
    function rgbString(v) {
      return v && (
        v.a < 255
          ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})`
          : `rgb(${v.r}, ${v.g}, ${v.b})`
      );
    }

    const to = v => v <= 0.0031308 ? v * 12.92 : Math.pow(v, 1.0 / 2.4) * 1.055 - 0.055;
    const from = v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    function interpolate$1(rgb1, rgb2, t) {
      const r = from(b2n(rgb1.r));
      const g = from(b2n(rgb1.g));
      const b = from(b2n(rgb1.b));
      return {
        r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
        g: n2b(to(g + t * (from(b2n(rgb2.g)) - g))),
        b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
        a: rgb1.a + t * (rgb2.a - rgb1.a)
      };
    }

    function modHSL(v, i, ratio) {
      if (v) {
        let tmp = rgb2hsl(v);
        tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
        tmp = hsl2rgb(tmp);
        v.r = tmp[0];
        v.g = tmp[1];
        v.b = tmp[2];
      }
    }
    function clone$1(v, proto) {
      return v ? Object.assign(proto || {}, v) : v;
    }
    function fromObject(input) {
      var v = {r: 0, g: 0, b: 0, a: 255};
      if (Array.isArray(input)) {
        if (input.length >= 3) {
          v = {r: input[0], g: input[1], b: input[2], a: 255};
          if (input.length > 3) {
            v.a = n2b(input[3]);
          }
        }
      } else {
        v = clone$1(input, {r: 0, g: 0, b: 0, a: 1});
        v.a = n2b(v.a);
      }
      return v;
    }
    function functionParse(str) {
      if (str.charAt(0) === 'r') {
        return rgbParse(str);
      }
      return hueParse(str);
    }
    class Color {
      constructor(input) {
        if (input instanceof Color) {
          return input;
        }
        const type = typeof input;
        let v;
        if (type === 'object') {
          v = fromObject(input);
        } else if (type === 'string') {
          v = hexParse(input) || nameParse(input) || functionParse(input);
        }
        this._rgb = v;
        this._valid = !!v;
      }
      get valid() {
        return this._valid;
      }
      get rgb() {
        var v = clone$1(this._rgb);
        if (v) {
          v.a = b2n(v.a);
        }
        return v;
      }
      set rgb(obj) {
        this._rgb = fromObject(obj);
      }
      rgbString() {
        return this._valid ? rgbString(this._rgb) : undefined;
      }
      hexString() {
        return this._valid ? hexString(this._rgb) : undefined;
      }
      hslString() {
        return this._valid ? hslString(this._rgb) : undefined;
      }
      mix(color, weight) {
        if (color) {
          const c1 = this.rgb;
          const c2 = color.rgb;
          let w2;
          const p = weight === w2 ? 0.5 : weight;
          const w = 2 * p - 1;
          const a = c1.a - c2.a;
          const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
          w2 = 1 - w1;
          c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5;
          c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5;
          c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5;
          c1.a = p * c1.a + (1 - p) * c2.a;
          this.rgb = c1;
        }
        return this;
      }
      interpolate(color, t) {
        if (color) {
          this._rgb = interpolate$1(this._rgb, color._rgb, t);
        }
        return this;
      }
      clone() {
        return new Color(this.rgb);
      }
      alpha(a) {
        this._rgb.a = n2b(a);
        return this;
      }
      clearer(ratio) {
        const rgb = this._rgb;
        rgb.a *= 1 - ratio;
        return this;
      }
      greyscale() {
        const rgb = this._rgb;
        const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
        rgb.r = rgb.g = rgb.b = val;
        return this;
      }
      opaquer(ratio) {
        const rgb = this._rgb;
        rgb.a *= 1 + ratio;
        return this;
      }
      negate() {
        const v = this._rgb;
        v.r = 255 - v.r;
        v.g = 255 - v.g;
        v.b = 255 - v.b;
        return this;
      }
      lighten(ratio) {
        modHSL(this._rgb, 2, ratio);
        return this;
      }
      darken(ratio) {
        modHSL(this._rgb, 2, -ratio);
        return this;
      }
      saturate(ratio) {
        modHSL(this._rgb, 1, ratio);
        return this;
      }
      desaturate(ratio) {
        modHSL(this._rgb, 1, -ratio);
        return this;
      }
      rotate(deg) {
        rotate(this._rgb, deg);
        return this;
      }
    }

    /*!
     * Chart.js v4.4.2
     * https://www.chartjs.org
     * (c) 2024 Chart.js Contributors
     * Released under the MIT License
     */

    /**
     * @namespace Chart.helpers
     */ /**
     * An empty function that can be used, for example, for optional callback.
     */ function noop() {
    /* noop */ }
    /**
     * Returns a unique id, sequentially generated from a global variable.
     */ const uid = (()=>{
        let id = 0;
        return ()=>id++;
    })();
    /**
     * Returns true if `value` is neither null nor undefined, else returns false.
     * @param value - The value to test.
     * @since 2.7.0
     */ function isNullOrUndef(value) {
        return value === null || typeof value === 'undefined';
    }
    /**
     * Returns true if `value` is an array (including typed arrays), else returns false.
     * @param value - The value to test.
     * @function
     */ function isArray(value) {
        if (Array.isArray && Array.isArray(value)) {
            return true;
        }
        const type = Object.prototype.toString.call(value);
        if (type.slice(0, 7) === '[object' && type.slice(-6) === 'Array]') {
            return true;
        }
        return false;
    }
    /**
     * Returns true if `value` is an object (excluding null), else returns false.
     * @param value - The value to test.
     * @since 2.7.0
     */ function isObject(value) {
        return value !== null && Object.prototype.toString.call(value) === '[object Object]';
    }
    /**
     * Returns true if `value` is a finite number, else returns false
     * @param value  - The value to test.
     */ function isNumberFinite(value) {
        return (typeof value === 'number' || value instanceof Number) && isFinite(+value);
    }
    /**
     * Returns `value` if finite, else returns `defaultValue`.
     * @param value - The value to return if defined.
     * @param defaultValue - The value to return if `value` is not finite.
     */ function finiteOrDefault(value, defaultValue) {
        return isNumberFinite(value) ? value : defaultValue;
    }
    /**
     * Returns `value` if defined, else returns `defaultValue`.
     * @param value - The value to return if defined.
     * @param defaultValue - The value to return if `value` is undefined.
     */ function valueOrDefault(value, defaultValue) {
        return typeof value === 'undefined' ? defaultValue : value;
    }
    const toPercentage = (value, dimension)=>typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 : +value / dimension;
    const toDimension = (value, dimension)=>typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 * dimension : +value;
    /**
     * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the
     * value returned by `fn`. If `fn` is not a function, this method returns undefined.
     * @param fn - The function to call.
     * @param args - The arguments with which `fn` should be called.
     * @param [thisArg] - The value of `this` provided for the call to `fn`.
     */ function callback(fn, args, thisArg) {
        if (fn && typeof fn.call === 'function') {
            return fn.apply(thisArg, args);
        }
    }
    function each(loopable, fn, thisArg, reverse) {
        let i, len, keys;
        if (isArray(loopable)) {
            len = loopable.length;
            if (reverse) {
                for(i = len - 1; i >= 0; i--){
                    fn.call(thisArg, loopable[i], i);
                }
            } else {
                for(i = 0; i < len; i++){
                    fn.call(thisArg, loopable[i], i);
                }
            }
        } else if (isObject(loopable)) {
            keys = Object.keys(loopable);
            len = keys.length;
            for(i = 0; i < len; i++){
                fn.call(thisArg, loopable[keys[i]], keys[i]);
            }
        }
    }
    /**
     * Returns true if the `a0` and `a1` arrays have the same content, else returns false.
     * @param a0 - The array to compare
     * @param a1 - The array to compare
     * @private
     */ function _elementsEqual(a0, a1) {
        let i, ilen, v0, v1;
        if (!a0 || !a1 || a0.length !== a1.length) {
            return false;
        }
        for(i = 0, ilen = a0.length; i < ilen; ++i){
            v0 = a0[i];
            v1 = a1[i];
            if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
                return false;
            }
        }
        return true;
    }
    /**
     * Returns a deep copy of `source` without keeping references on objects and arrays.
     * @param source - The value to clone.
     */ function clone(source) {
        if (isArray(source)) {
            return source.map(clone);
        }
        if (isObject(source)) {
            const target = Object.create(null);
            const keys = Object.keys(source);
            const klen = keys.length;
            let k = 0;
            for(; k < klen; ++k){
                target[keys[k]] = clone(source[keys[k]]);
            }
            return target;
        }
        return source;
    }
    function isValidKey(key) {
        return [
            '__proto__',
            'prototype',
            'constructor'
        ].indexOf(key) === -1;
    }
    /**
     * The default merger when Chart.helpers.merge is called without merger option.
     * Note(SB): also used by mergeConfig and mergeScaleConfig as fallback.
     * @private
     */ function _merger(key, target, source, options) {
        if (!isValidKey(key)) {
            return;
        }
        const tval = target[key];
        const sval = source[key];
        if (isObject(tval) && isObject(sval)) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            merge(tval, sval, options);
        } else {
            target[key] = clone(sval);
        }
    }
    function merge(target, source, options) {
        const sources = isArray(source) ? source : [
            source
        ];
        const ilen = sources.length;
        if (!isObject(target)) {
            return target;
        }
        options = options || {};
        const merger = options.merger || _merger;
        let current;
        for(let i = 0; i < ilen; ++i){
            current = sources[i];
            if (!isObject(current)) {
                continue;
            }
            const keys = Object.keys(current);
            for(let k = 0, klen = keys.length; k < klen; ++k){
                merger(keys[k], target, current, options);
            }
        }
        return target;
    }
    function mergeIf(target, source) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return merge(target, source, {
            merger: _mergerIf
        });
    }
    /**
     * Merges source[key] in target[key] only if target[key] is undefined.
     * @private
     */ function _mergerIf(key, target, source) {
        if (!isValidKey(key)) {
            return;
        }
        const tval = target[key];
        const sval = source[key];
        if (isObject(tval) && isObject(sval)) {
            mergeIf(tval, sval);
        } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
            target[key] = clone(sval);
        }
    }
    // resolveObjectKey resolver cache
    const keyResolvers = {
        // Chart.helpers.core resolveObjectKey should resolve empty key to root object
        '': (v)=>v,
        // default resolvers
        x: (o)=>o.x,
        y: (o)=>o.y
    };
    /**
     * @private
     */ function _splitKey(key) {
        const parts = key.split('.');
        const keys = [];
        let tmp = '';
        for (const part of parts){
            tmp += part;
            if (tmp.endsWith('\\')) {
                tmp = tmp.slice(0, -1) + '.';
            } else {
                keys.push(tmp);
                tmp = '';
            }
        }
        return keys;
    }
    function _getKeyResolver(key) {
        const keys = _splitKey(key);
        return (obj)=>{
            for (const k of keys){
                if (k === '') {
                    break;
                }
                obj = obj && obj[k];
            }
            return obj;
        };
    }
    function resolveObjectKey(obj, key) {
        const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
        return resolver(obj);
    }
    /**
     * @private
     */ function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const defined = (value)=>typeof value !== 'undefined';
    const isFunction = (value)=>typeof value === 'function';
    // Adapted from https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality#31129384
    const setsEqual = (a, b)=>{
        if (a.size !== b.size) {
            return false;
        }
        for (const item of a){
            if (!b.has(item)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @param e - The event
     * @private
     */ function _isClickEvent(e) {
        return e.type === 'mouseup' || e.type === 'click' || e.type === 'contextmenu';
    }

    /**
     * @alias Chart.helpers.math
     * @namespace
     */ const PI = Math.PI;
    const TAU = 2 * PI;
    const PITAU = TAU + PI;
    const INFINITY = Number.POSITIVE_INFINITY;
    const RAD_PER_DEG = PI / 180;
    const HALF_PI = PI / 2;
    const QUARTER_PI = PI / 4;
    const TWO_THIRDS_PI = PI * 2 / 3;
    const log10 = Math.log10;
    const sign = Math.sign;
    function almostEquals(x, y, epsilon) {
        return Math.abs(x - y) < epsilon;
    }
    /**
     * Implementation of the nice number algorithm used in determining where axis labels will go
     */ function niceNum(range) {
        const roundedRange = Math.round(range);
        range = almostEquals(range, roundedRange, range / 1000) ? roundedRange : range;
        const niceRange = Math.pow(10, Math.floor(log10(range)));
        const fraction = range / niceRange;
        const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
        return niceFraction * niceRange;
    }
    /**
     * Returns an array of factors sorted from 1 to sqrt(value)
     * @private
     */ function _factorize(value) {
        const result = [];
        const sqrt = Math.sqrt(value);
        let i;
        for(i = 1; i < sqrt; i++){
            if (value % i === 0) {
                result.push(i);
                result.push(value / i);
            }
        }
        if (sqrt === (sqrt | 0)) {
            result.push(sqrt);
        }
        result.sort((a, b)=>a - b).pop();
        return result;
    }
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function almostWhole(x, epsilon) {
        const rounded = Math.round(x);
        return rounded - epsilon <= x && rounded + epsilon >= x;
    }
    /**
     * @private
     */ function _setMinAndMaxByKey(array, target, property) {
        let i, ilen, value;
        for(i = 0, ilen = array.length; i < ilen; i++){
            value = array[i][property];
            if (!isNaN(value)) {
                target.min = Math.min(target.min, value);
                target.max = Math.max(target.max, value);
            }
        }
    }
    function toRadians(degrees) {
        return degrees * (PI / 180);
    }
    function toDegrees(radians) {
        return radians * (180 / PI);
    }
    /**
     * Returns the number of decimal places
     * i.e. the number of digits after the decimal point, of the value of this Number.
     * @param x - A number.
     * @returns The number of decimal places.
     * @private
     */ function _decimalPlaces(x) {
        if (!isNumberFinite(x)) {
            return;
        }
        let e = 1;
        let p = 0;
        while(Math.round(x * e) / e !== x){
            e *= 10;
            p++;
        }
        return p;
    }
    // Gets the angle from vertical upright to the point about a centre.
    function getAngleFromPoint(centrePoint, anglePoint) {
        const distanceFromXCenter = anglePoint.x - centrePoint.x;
        const distanceFromYCenter = anglePoint.y - centrePoint.y;
        const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
        let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
        if (angle < -0.5 * PI) {
            angle += TAU; // make sure the returned angle is in the range of (-PI/2, 3PI/2]
        }
        return {
            angle,
            distance: radialDistanceFromCenter
        };
    }
    function distanceBetweenPoints(pt1, pt2) {
        return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
    }
    /**
     * Shortest distance between angles, in either direction.
     * @private
     */ function _angleDiff(a, b) {
        return (a - b + PITAU) % TAU - PI;
    }
    /**
     * Normalize angle to be between 0 and 2*PI
     * @private
     */ function _normalizeAngle(a) {
        return (a % TAU + TAU) % TAU;
    }
    /**
     * @private
     */ function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
        const a = _normalizeAngle(angle);
        const s = _normalizeAngle(start);
        const e = _normalizeAngle(end);
        const angleToStart = _normalizeAngle(s - a);
        const angleToEnd = _normalizeAngle(e - a);
        const startToAngle = _normalizeAngle(a - s);
        const endToAngle = _normalizeAngle(a - e);
        return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
    }
    /**
     * Limit `value` between `min` and `max`
     * @param value
     * @param min
     * @param max
     * @private
     */ function _limitValue(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    /**
     * @param {number} value
     * @private
     */ function _int16Range(value) {
        return _limitValue(value, -32768, 32767);
    }
    /**
     * @param value
     * @param start
     * @param end
     * @param [epsilon]
     * @private
     */ function _isBetween(value, start, end, epsilon = 1e-6) {
        return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
    }

    function _lookup(table, value, cmp) {
        cmp = cmp || ((index)=>table[index] < value);
        let hi = table.length - 1;
        let lo = 0;
        let mid;
        while(hi - lo > 1){
            mid = lo + hi >> 1;
            if (cmp(mid)) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        return {
            lo,
            hi
        };
    }
    /**
     * Binary search
     * @param table - the table search. must be sorted!
     * @param key - property name for the value in each entry
     * @param value - value to find
     * @param last - lookup last index
     * @private
     */ const _lookupByKey = (table, key, value, last)=>_lookup(table, value, last ? (index)=>{
            const ti = table[index][key];
            return ti < value || ti === value && table[index + 1][key] === value;
        } : (index)=>table[index][key] < value);
    /**
     * Reverse binary search
     * @param table - the table search. must be sorted!
     * @param key - property name for the value in each entry
     * @param value - value to find
     * @private
     */ const _rlookupByKey = (table, key, value)=>_lookup(table, value, (index)=>table[index][key] >= value);
    /**
     * Return subset of `values` between `min` and `max` inclusive.
     * Values are assumed to be in sorted order.
     * @param values - sorted array of values
     * @param min - min value
     * @param max - max value
     */ function _filterBetween(values, min, max) {
        let start = 0;
        let end = values.length;
        while(start < end && values[start] < min){
            start++;
        }
        while(end > start && values[end - 1] > max){
            end--;
        }
        return start > 0 || end < values.length ? values.slice(start, end) : values;
    }
    const arrayEvents = [
        'push',
        'pop',
        'shift',
        'splice',
        'unshift'
    ];
    function listenArrayEvents(array, listener) {
        if (array._chartjs) {
            array._chartjs.listeners.push(listener);
            return;
        }
        Object.defineProperty(array, '_chartjs', {
            configurable: true,
            enumerable: false,
            value: {
                listeners: [
                    listener
                ]
            }
        });
        arrayEvents.forEach((key)=>{
            const method = '_onData' + _capitalize(key);
            const base = array[key];
            Object.defineProperty(array, key, {
                configurable: true,
                enumerable: false,
                value (...args) {
                    const res = base.apply(this, args);
                    array._chartjs.listeners.forEach((object)=>{
                        if (typeof object[method] === 'function') {
                            object[method](...args);
                        }
                    });
                    return res;
                }
            });
        });
    }
    function unlistenArrayEvents(array, listener) {
        const stub = array._chartjs;
        if (!stub) {
            return;
        }
        const listeners = stub.listeners;
        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
        if (listeners.length > 0) {
            return;
        }
        arrayEvents.forEach((key)=>{
            delete array[key];
        });
        delete array._chartjs;
    }
    /**
     * @param items
     */ function _arrayUnique(items) {
        const set = new Set(items);
        if (set.size === items.length) {
            return items;
        }
        return Array.from(set);
    }
    /**
    * Request animation polyfill
    */ const requestAnimFrame = function() {
        if (typeof window === 'undefined') {
            return function(callback) {
                return callback();
            };
        }
        return window.requestAnimationFrame;
    }();
    /**
     * Throttles calling `fn` once per animation frame
     * Latest arguments are used on the actual call
     */ function throttled(fn, thisArg) {
        let argsToUse = [];
        let ticking = false;
        return function(...args) {
            // Save the args for use later
            argsToUse = args;
            if (!ticking) {
                ticking = true;
                requestAnimFrame.call(window, ()=>{
                    ticking = false;
                    fn.apply(thisArg, argsToUse);
                });
            }
        };
    }
    /**
     * Debounces calling `fn` for `delay` ms
     */ function debounce(fn, delay) {
        let timeout;
        return function(...args) {
            if (delay) {
                clearTimeout(timeout);
                timeout = setTimeout(fn, delay, args);
            } else {
                fn.apply(this, args);
            }
            return delay;
        };
    }
    /**
     * Converts 'start' to 'left', 'end' to 'right' and others to 'center'
     * @private
     */ const _toLeftRightCenter = (align)=>align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
    /**
     * Returns `start`, `end` or `(start + end) / 2` depending on `align`. Defaults to `center`
     * @private
     */ const _alignStartEnd = (align, start, end)=>align === 'start' ? start : align === 'end' ? end : (start + end) / 2;
    /**
     * Returns `left`, `right` or `(left + right) / 2` depending on `align`. Defaults to `left`
     * @private
     */ const _textX = (align, left, right, rtl)=>{
        const check = rtl ? 'left' : 'right';
        return align === check ? right : align === 'center' ? (left + right) / 2 : left;
    };
    /**
     * Return start and count of visible points.
     * @private
     */ function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
        const pointCount = points.length;
        let start = 0;
        let count = pointCount;
        if (meta._sorted) {
            const { iScale , _parsed  } = meta;
            const axis = iScale.axis;
            const { min , max , minDefined , maxDefined  } = iScale.getUserBounds();
            if (minDefined) {
                start = _limitValue(Math.min(// @ts-expect-error Need to type _parsed
                _lookupByKey(_parsed, axis, min).lo, // @ts-expect-error Need to fix types on _lookupByKey
                animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo), 0, pointCount - 1);
            }
            if (maxDefined) {
                count = _limitValue(Math.max(// @ts-expect-error Need to type _parsed
                _lookupByKey(_parsed, iScale.axis, max, true).hi + 1, // @ts-expect-error Need to fix types on _lookupByKey
                animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max), true).hi + 1), start, pointCount) - start;
            } else {
                count = pointCount - start;
            }
        }
        return {
            start,
            count
        };
    }
    /**
     * Checks if the scale ranges have changed.
     * @param {object} meta - dataset meta.
     * @returns {boolean}
     * @private
     */ function _scaleRangesChanged(meta) {
        const { xScale , yScale , _scaleRanges  } = meta;
        const newRanges = {
            xmin: xScale.min,
            xmax: xScale.max,
            ymin: yScale.min,
            ymax: yScale.max
        };
        if (!_scaleRanges) {
            meta._scaleRanges = newRanges;
            return true;
        }
        const changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
        Object.assign(_scaleRanges, newRanges);
        return changed;
    }

    const atEdge = (t)=>t === 0 || t === 1;
    const elasticIn = (t, s, p)=>-(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
    const elasticOut = (t, s, p)=>Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
    /**
     * Easing functions adapted from Robert Penner's easing equations.
     * @namespace Chart.helpers.easing.effects
     * @see http://www.robertpenner.com/easing/
     */ const effects = {
        linear: (t)=>t,
        easeInQuad: (t)=>t * t,
        easeOutQuad: (t)=>-t * (t - 2),
        easeInOutQuad: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
        easeInCubic: (t)=>t * t * t,
        easeOutCubic: (t)=>(t -= 1) * t * t + 1,
        easeInOutCubic: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
        easeInQuart: (t)=>t * t * t * t,
        easeOutQuart: (t)=>-((t -= 1) * t * t * t - 1),
        easeInOutQuart: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
        easeInQuint: (t)=>t * t * t * t * t,
        easeOutQuint: (t)=>(t -= 1) * t * t * t * t + 1,
        easeInOutQuint: (t)=>(t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
        easeInSine: (t)=>-Math.cos(t * HALF_PI) + 1,
        easeOutSine: (t)=>Math.sin(t * HALF_PI),
        easeInOutSine: (t)=>-0.5 * (Math.cos(PI * t) - 1),
        easeInExpo: (t)=>t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
        easeOutExpo: (t)=>t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
        easeInOutExpo: (t)=>atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
        easeInCirc: (t)=>t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
        easeOutCirc: (t)=>Math.sqrt(1 - (t -= 1) * t),
        easeInOutCirc: (t)=>(t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
        easeInElastic: (t)=>atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
        easeOutElastic: (t)=>atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
        easeInOutElastic (t) {
            const s = 0.1125;
            const p = 0.45;
            return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
        },
        easeInBack (t) {
            const s = 1.70158;
            return t * t * ((s + 1) * t - s);
        },
        easeOutBack (t) {
            const s = 1.70158;
            return (t -= 1) * t * ((s + 1) * t + s) + 1;
        },
        easeInOutBack (t) {
            let s = 1.70158;
            if ((t /= 0.5) < 1) {
                return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
            }
            return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
        },
        easeInBounce: (t)=>1 - effects.easeOutBounce(1 - t),
        easeOutBounce (t) {
            const m = 7.5625;
            const d = 2.75;
            if (t < 1 / d) {
                return m * t * t;
            }
            if (t < 2 / d) {
                return m * (t -= 1.5 / d) * t + 0.75;
            }
            if (t < 2.5 / d) {
                return m * (t -= 2.25 / d) * t + 0.9375;
            }
            return m * (t -= 2.625 / d) * t + 0.984375;
        },
        easeInOutBounce: (t)=>t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
    };

    function isPatternOrGradient(value) {
        if (value && typeof value === 'object') {
            const type = value.toString();
            return type === '[object CanvasPattern]' || type === '[object CanvasGradient]';
        }
        return false;
    }
    function color(value) {
        return isPatternOrGradient(value) ? value : new Color(value);
    }
    function getHoverColor(value) {
        return isPatternOrGradient(value) ? value : new Color(value).saturate(0.5).darken(0.1).hexString();
    }

    const numbers = [
        'x',
        'y',
        'borderWidth',
        'radius',
        'tension'
    ];
    const colors = [
        'color',
        'borderColor',
        'backgroundColor'
    ];
    function applyAnimationsDefaults(defaults) {
        defaults.set('animation', {
            delay: undefined,
            duration: 1000,
            easing: 'easeOutQuart',
            fn: undefined,
            from: undefined,
            loop: undefined,
            to: undefined,
            type: undefined
        });
        defaults.describe('animation', {
            _fallback: false,
            _indexable: false,
            _scriptable: (name)=>name !== 'onProgress' && name !== 'onComplete' && name !== 'fn'
        });
        defaults.set('animations', {
            colors: {
                type: 'color',
                properties: colors
            },
            numbers: {
                type: 'number',
                properties: numbers
            }
        });
        defaults.describe('animations', {
            _fallback: 'animation'
        });
        defaults.set('transitions', {
            active: {
                animation: {
                    duration: 400
                }
            },
            resize: {
                animation: {
                    duration: 0
                }
            },
            show: {
                animations: {
                    colors: {
                        from: 'transparent'
                    },
                    visible: {
                        type: 'boolean',
                        duration: 0
                    }
                }
            },
            hide: {
                animations: {
                    colors: {
                        to: 'transparent'
                    },
                    visible: {
                        type: 'boolean',
                        easing: 'linear',
                        fn: (v)=>v | 0
                    }
                }
            }
        });
    }

    function applyLayoutsDefaults(defaults) {
        defaults.set('layout', {
            autoPadding: true,
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        });
    }

    const intlCache = new Map();
    function getNumberFormat(locale, options) {
        options = options || {};
        const cacheKey = locale + JSON.stringify(options);
        let formatter = intlCache.get(cacheKey);
        if (!formatter) {
            formatter = new Intl.NumberFormat(locale, options);
            intlCache.set(cacheKey, formatter);
        }
        return formatter;
    }
    function formatNumber(num, locale, options) {
        return getNumberFormat(locale, options).format(num);
    }

    const formatters = {
     values (value) {
            return isArray(value) ?  value : '' + value;
        },
     numeric (tickValue, index, ticks) {
            if (tickValue === 0) {
                return '0';
            }
            const locale = this.chart.options.locale;
            let notation;
            let delta = tickValue;
            if (ticks.length > 1) {
                const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
                if (maxTick < 1e-4 || maxTick > 1e+15) {
                    notation = 'scientific';
                }
                delta = calculateDelta(tickValue, ticks);
            }
            const logDelta = log10(Math.abs(delta));
            const numDecimal = isNaN(logDelta) ? 1 : Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
            const options = {
                notation,
                minimumFractionDigits: numDecimal,
                maximumFractionDigits: numDecimal
            };
            Object.assign(options, this.options.ticks.format);
            return formatNumber(tickValue, locale, options);
        },
     logarithmic (tickValue, index, ticks) {
            if (tickValue === 0) {
                return '0';
            }
            const remain = ticks[index].significand || tickValue / Math.pow(10, Math.floor(log10(tickValue)));
            if ([
                1,
                2,
                3,
                5,
                10,
                15
            ].includes(remain) || index > 0.8 * ticks.length) {
                return formatters.numeric.call(this, tickValue, index, ticks);
            }
            return '';
        }
    };
    function calculateDelta(tickValue, ticks) {
        let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
        if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
            delta = tickValue - Math.floor(tickValue);
        }
        return delta;
    }
     var Ticks = {
        formatters
    };

    function applyScaleDefaults(defaults) {
        defaults.set('scale', {
            display: true,
            offset: false,
            reverse: false,
            beginAtZero: false,
     bounds: 'ticks',
            clip: true,
     grace: 0,
            grid: {
                display: true,
                lineWidth: 1,
                drawOnChartArea: true,
                drawTicks: true,
                tickLength: 8,
                tickWidth: (_ctx, options)=>options.lineWidth,
                tickColor: (_ctx, options)=>options.color,
                offset: false
            },
            border: {
                display: true,
                dash: [],
                dashOffset: 0.0,
                width: 1
            },
            title: {
                display: false,
                text: '',
                padding: {
                    top: 4,
                    bottom: 4
                }
            },
            ticks: {
                minRotation: 0,
                maxRotation: 50,
                mirror: false,
                textStrokeWidth: 0,
                textStrokeColor: '',
                padding: 3,
                display: true,
                autoSkip: true,
                autoSkipPadding: 3,
                labelOffset: 0,
                callback: Ticks.formatters.values,
                minor: {},
                major: {},
                align: 'center',
                crossAlign: 'near',
                showLabelBackdrop: false,
                backdropColor: 'rgba(255, 255, 255, 0.75)',
                backdropPadding: 2
            }
        });
        defaults.route('scale.ticks', 'color', '', 'color');
        defaults.route('scale.grid', 'color', '', 'borderColor');
        defaults.route('scale.border', 'color', '', 'borderColor');
        defaults.route('scale.title', 'color', '', 'color');
        defaults.describe('scale', {
            _fallback: false,
            _scriptable: (name)=>!name.startsWith('before') && !name.startsWith('after') && name !== 'callback' && name !== 'parser',
            _indexable: (name)=>name !== 'borderDash' && name !== 'tickBorderDash' && name !== 'dash'
        });
        defaults.describe('scales', {
            _fallback: 'scale'
        });
        defaults.describe('scale.ticks', {
            _scriptable: (name)=>name !== 'backdropPadding' && name !== 'callback',
            _indexable: (name)=>name !== 'backdropPadding'
        });
    }

    const overrides = Object.create(null);
    const descriptors = Object.create(null);
     function getScope$1(node, key) {
        if (!key) {
            return node;
        }
        const keys = key.split('.');
        for(let i = 0, n = keys.length; i < n; ++i){
            const k = keys[i];
            node = node[k] || (node[k] = Object.create(null));
        }
        return node;
    }
    function set(root, scope, values) {
        if (typeof scope === 'string') {
            return merge(getScope$1(root, scope), values);
        }
        return merge(getScope$1(root, ''), scope);
    }
     class Defaults {
        constructor(_descriptors, _appliers){
            this.animation = undefined;
            this.backgroundColor = 'rgba(0,0,0,0.1)';
            this.borderColor = 'rgba(0,0,0,0.1)';
            this.color = '#666';
            this.datasets = {};
            this.devicePixelRatio = (context)=>context.chart.platform.getDevicePixelRatio();
            this.elements = {};
            this.events = [
                'mousemove',
                'mouseout',
                'click',
                'touchstart',
                'touchmove'
            ];
            this.font = {
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                size: 12,
                style: 'normal',
                lineHeight: 1.2,
                weight: null
            };
            this.hover = {};
            this.hoverBackgroundColor = (ctx, options)=>getHoverColor(options.backgroundColor);
            this.hoverBorderColor = (ctx, options)=>getHoverColor(options.borderColor);
            this.hoverColor = (ctx, options)=>getHoverColor(options.color);
            this.indexAxis = 'x';
            this.interaction = {
                mode: 'nearest',
                intersect: true,
                includeInvisible: false
            };
            this.maintainAspectRatio = true;
            this.onHover = null;
            this.onClick = null;
            this.parsing = true;
            this.plugins = {};
            this.responsive = true;
            this.scale = undefined;
            this.scales = {};
            this.showLine = true;
            this.drawActiveElementsOnTop = true;
            this.describe(_descriptors);
            this.apply(_appliers);
        }
     set(scope, values) {
            return set(this, scope, values);
        }
     get(scope) {
            return getScope$1(this, scope);
        }
     describe(scope, values) {
            return set(descriptors, scope, values);
        }
        override(scope, values) {
            return set(overrides, scope, values);
        }
     route(scope, name, targetScope, targetName) {
            const scopeObject = getScope$1(this, scope);
            const targetScopeObject = getScope$1(this, targetScope);
            const privateName = '_' + name;
            Object.defineProperties(scopeObject, {
                [privateName]: {
                    value: scopeObject[name],
                    writable: true
                },
                [name]: {
                    enumerable: true,
                    get () {
                        const local = this[privateName];
                        const target = targetScopeObject[targetName];
                        if (isObject(local)) {
                            return Object.assign({}, target, local);
                        }
                        return valueOrDefault(local, target);
                    },
                    set (value) {
                        this[privateName] = value;
                    }
                }
            });
        }
        apply(appliers) {
            appliers.forEach((apply)=>apply(this));
        }
    }
    var defaults = /* #__PURE__ */ new Defaults({
        _scriptable: (name)=>!name.startsWith('on'),
        _indexable: (name)=>name !== 'events',
        hover: {
            _fallback: 'interaction'
        },
        interaction: {
            _scriptable: false,
            _indexable: false
        }
    }, [
        applyAnimationsDefaults,
        applyLayoutsDefaults,
        applyScaleDefaults
    ]);

    /**
     * Converts the given font object into a CSS font string.
     * @param font - A font object.
     * @return The CSS font string. See https://developer.mozilla.org/en-US/docs/Web/CSS/font
     * @private
     */ function toFontString(font) {
        if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
            return null;
        }
        return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family;
    }
    /**
     * @private
     */ function _measureText(ctx, data, gc, longest, string) {
        let textWidth = data[string];
        if (!textWidth) {
            textWidth = data[string] = ctx.measureText(string).width;
            gc.push(string);
        }
        if (textWidth > longest) {
            longest = textWidth;
        }
        return longest;
    }
    /**
     * @private
     */ // eslint-disable-next-line complexity
    function _longestText(ctx, font, arrayOfThings, cache) {
        cache = cache || {};
        let data = cache.data = cache.data || {};
        let gc = cache.garbageCollect = cache.garbageCollect || [];
        if (cache.font !== font) {
            data = cache.data = {};
            gc = cache.garbageCollect = [];
            cache.font = font;
        }
        ctx.save();
        ctx.font = font;
        let longest = 0;
        const ilen = arrayOfThings.length;
        let i, j, jlen, thing, nestedThing;
        for(i = 0; i < ilen; i++){
            thing = arrayOfThings[i];
            // Undefined strings and arrays should not be measured
            if (thing !== undefined && thing !== null && !isArray(thing)) {
                longest = _measureText(ctx, data, gc, longest, thing);
            } else if (isArray(thing)) {
                // if it is an array lets measure each element
                // to do maybe simplify this function a bit so we can do this more recursively?
                for(j = 0, jlen = thing.length; j < jlen; j++){
                    nestedThing = thing[j];
                    // Undefined strings and arrays should not be measured
                    if (nestedThing !== undefined && nestedThing !== null && !isArray(nestedThing)) {
                        longest = _measureText(ctx, data, gc, longest, nestedThing);
                    }
                }
            }
        }
        ctx.restore();
        const gcLen = gc.length / 2;
        if (gcLen > arrayOfThings.length) {
            for(i = 0; i < gcLen; i++){
                delete data[gc[i]];
            }
            gc.splice(0, gcLen);
        }
        return longest;
    }
    /**
     * Returns the aligned pixel value to avoid anti-aliasing blur
     * @param chart - The chart instance.
     * @param pixel - A pixel value.
     * @param width - The width of the element.
     * @returns The aligned pixel value.
     * @private
     */ function _alignPixel(chart, pixel, width) {
        const devicePixelRatio = chart.currentDevicePixelRatio;
        const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
        return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
    }
    /**
     * Clears the entire canvas.
     */ function clearCanvas(canvas, ctx) {
        ctx = ctx || canvas.getContext('2d');
        ctx.save();
        // canvas.width and canvas.height do not consider the canvas transform,
        // while clearRect does
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
    function drawPoint(ctx, options, x, y) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        drawPointLegend(ctx, options, x, y, null);
    }
    // eslint-disable-next-line complexity
    function drawPointLegend(ctx, options, x, y, w) {
        let type, xOffset, yOffset, size, cornerRadius, width, xOffsetW, yOffsetW;
        const style = options.pointStyle;
        const rotation = options.rotation;
        const radius = options.radius;
        let rad = (rotation || 0) * RAD_PER_DEG;
        if (style && typeof style === 'object') {
            type = style.toString();
            if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rad);
                ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
                ctx.restore();
                return;
            }
        }
        if (isNaN(radius) || radius <= 0) {
            return;
        }
        ctx.beginPath();
        switch(style){
            // Default includes circle
            default:
                if (w) {
                    ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU);
                } else {
                    ctx.arc(x, y, radius, 0, TAU);
                }
                ctx.closePath();
                break;
            case 'triangle':
                width = w ? w / 2 : radius;
                ctx.moveTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
                rad += TWO_THIRDS_PI;
                ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
                rad += TWO_THIRDS_PI;
                ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
                ctx.closePath();
                break;
            case 'rectRounded':
                // NOTE: the rounded rect implementation changed to use `arc` instead of
                // `quadraticCurveTo` since it generates better results when rect is
                // almost a circle. 0.516 (instead of 0.5) produces results with visually
                // closer proportion to the previous impl and it is inscribed in the
                // circle with `radius`. For more details, see the following PRs:
                // https://github.com/chartjs/Chart.js/issues/5597
                // https://github.com/chartjs/Chart.js/issues/5858
                cornerRadius = radius * 0.516;
                size = radius - cornerRadius;
                xOffset = Math.cos(rad + QUARTER_PI) * size;
                xOffsetW = Math.cos(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
                yOffset = Math.sin(rad + QUARTER_PI) * size;
                yOffsetW = Math.sin(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
                ctx.arc(x - xOffsetW, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
                ctx.arc(x + yOffsetW, y - xOffset, cornerRadius, rad - HALF_PI, rad);
                ctx.arc(x + xOffsetW, y + yOffset, cornerRadius, rad, rad + HALF_PI);
                ctx.arc(x - yOffsetW, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
                ctx.closePath();
                break;
            case 'rect':
                if (!rotation) {
                    size = Math.SQRT1_2 * radius;
                    width = w ? w / 2 : size;
                    ctx.rect(x - width, y - size, 2 * width, 2 * size);
                    break;
                }
                rad += QUARTER_PI;
            /* falls through */ case 'rectRot':
                xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
                ctx.moveTo(x - xOffsetW, y - yOffset);
                ctx.lineTo(x + yOffsetW, y - xOffset);
                ctx.lineTo(x + xOffsetW, y + yOffset);
                ctx.lineTo(x - yOffsetW, y + xOffset);
                ctx.closePath();
                break;
            case 'crossRot':
                rad += QUARTER_PI;
            /* falls through */ case 'cross':
                xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
                ctx.moveTo(x - xOffsetW, y - yOffset);
                ctx.lineTo(x + xOffsetW, y + yOffset);
                ctx.moveTo(x + yOffsetW, y - xOffset);
                ctx.lineTo(x - yOffsetW, y + xOffset);
                break;
            case 'star':
                xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
                ctx.moveTo(x - xOffsetW, y - yOffset);
                ctx.lineTo(x + xOffsetW, y + yOffset);
                ctx.moveTo(x + yOffsetW, y - xOffset);
                ctx.lineTo(x - yOffsetW, y + xOffset);
                rad += QUARTER_PI;
                xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
                xOffset = Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
                ctx.moveTo(x - xOffsetW, y - yOffset);
                ctx.lineTo(x + xOffsetW, y + yOffset);
                ctx.moveTo(x + yOffsetW, y - xOffset);
                ctx.lineTo(x - yOffsetW, y + xOffset);
                break;
            case 'line':
                xOffset = w ? w / 2 : Math.cos(rad) * radius;
                yOffset = Math.sin(rad) * radius;
                ctx.moveTo(x - xOffset, y - yOffset);
                ctx.lineTo(x + xOffset, y + yOffset);
                break;
            case 'dash':
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(rad) * (w ? w / 2 : radius), y + Math.sin(rad) * radius);
                break;
            case false:
                ctx.closePath();
                break;
        }
        ctx.fill();
        if (options.borderWidth > 0) {
            ctx.stroke();
        }
    }
    /**
     * Returns true if the point is inside the rectangle
     * @param point - The point to test
     * @param area - The rectangle
     * @param margin - allowed margin
     * @private
     */ function _isPointInArea(point, area, margin) {
        margin = margin || 0.5; // margin - default is to match rounded decimals
        return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
    }
    function clipArea(ctx, area) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
        ctx.clip();
    }
    function unclipArea(ctx) {
        ctx.restore();
    }
    /**
     * @private
     */ function _steppedLineTo(ctx, previous, target, flip, mode) {
        if (!previous) {
            return ctx.lineTo(target.x, target.y);
        }
        if (mode === 'middle') {
            const midpoint = (previous.x + target.x) / 2.0;
            ctx.lineTo(midpoint, previous.y);
            ctx.lineTo(midpoint, target.y);
        } else if (mode === 'after' !== !!flip) {
            ctx.lineTo(previous.x, target.y);
        } else {
            ctx.lineTo(target.x, previous.y);
        }
        ctx.lineTo(target.x, target.y);
    }
    /**
     * @private
     */ function _bezierCurveTo(ctx, previous, target, flip) {
        if (!previous) {
            return ctx.lineTo(target.x, target.y);
        }
        ctx.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
    }
    function setRenderOpts(ctx, opts) {
        if (opts.translation) {
            ctx.translate(opts.translation[0], opts.translation[1]);
        }
        if (!isNullOrUndef(opts.rotation)) {
            ctx.rotate(opts.rotation);
        }
        if (opts.color) {
            ctx.fillStyle = opts.color;
        }
        if (opts.textAlign) {
            ctx.textAlign = opts.textAlign;
        }
        if (opts.textBaseline) {
            ctx.textBaseline = opts.textBaseline;
        }
    }
    function decorateText(ctx, x, y, line, opts) {
        if (opts.strikethrough || opts.underline) {
            /**
         * Now that IE11 support has been dropped, we can use more
         * of the TextMetrics object. The actual bounding boxes
         * are unflagged in Chrome, Firefox, Edge, and Safari so they
         * can be safely used.
         * See https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics#Browser_compatibility
         */ const metrics = ctx.measureText(line);
            const left = x - metrics.actualBoundingBoxLeft;
            const right = x + metrics.actualBoundingBoxRight;
            const top = y - metrics.actualBoundingBoxAscent;
            const bottom = y + metrics.actualBoundingBoxDescent;
            const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.beginPath();
            ctx.lineWidth = opts.decorationWidth || 2;
            ctx.moveTo(left, yDecoration);
            ctx.lineTo(right, yDecoration);
            ctx.stroke();
        }
    }
    function drawBackdrop(ctx, opts) {
        const oldColor = ctx.fillStyle;
        ctx.fillStyle = opts.color;
        ctx.fillRect(opts.left, opts.top, opts.width, opts.height);
        ctx.fillStyle = oldColor;
    }
    /**
     * Render text onto the canvas
     */ function renderText(ctx, text, x, y, font, opts = {}) {
        const lines = isArray(text) ? text : [
            text
        ];
        const stroke = opts.strokeWidth > 0 && opts.strokeColor !== '';
        let i, line;
        ctx.save();
        ctx.font = font.string;
        setRenderOpts(ctx, opts);
        for(i = 0; i < lines.length; ++i){
            line = lines[i];
            if (opts.backdrop) {
                drawBackdrop(ctx, opts.backdrop);
            }
            if (stroke) {
                if (opts.strokeColor) {
                    ctx.strokeStyle = opts.strokeColor;
                }
                if (!isNullOrUndef(opts.strokeWidth)) {
                    ctx.lineWidth = opts.strokeWidth;
                }
                ctx.strokeText(line, x, y, opts.maxWidth);
            }
            ctx.fillText(line, x, y, opts.maxWidth);
            decorateText(ctx, x, y, line, opts);
            y += Number(font.lineHeight);
        }
        ctx.restore();
    }
    /**
     * Add a path of a rectangle with rounded corners to the current sub-path
     * @param ctx - Context
     * @param rect - Bounding rect
     */ function addRoundedRectPath(ctx, rect) {
        const { x , y , w , h , radius  } = rect;
        // top left arc
        ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, 1.5 * PI, PI, true);
        // line from top left to bottom left
        ctx.lineTo(x, y + h - radius.bottomLeft);
        // bottom left arc
        ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
        // line from bottom left to bottom right
        ctx.lineTo(x + w - radius.bottomRight, y + h);
        // bottom right arc
        ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
        // line from bottom right to top right
        ctx.lineTo(x + w, y + radius.topRight);
        // top right arc
        ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
        // line from top right to top left
        ctx.lineTo(x + radius.topLeft, y);
    }

    const LINE_HEIGHT = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/;
    const FONT_STYLE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
    /**
     * @alias Chart.helpers.options
     * @namespace
     */ /**
     * Converts the given line height `value` in pixels for a specific font `size`.
     * @param value - The lineHeight to parse (eg. 1.6, '14px', '75%', '1.6em').
     * @param size - The font size (in pixels) used to resolve relative `value`.
     * @returns The effective line height in pixels (size * 1.2 if value is invalid).
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
     * @since 2.7.0
     */ function toLineHeight(value, size) {
        const matches = ('' + value).match(LINE_HEIGHT);
        if (!matches || matches[1] === 'normal') {
            return size * 1.2;
        }
        value = +matches[2];
        switch(matches[3]){
            case 'px':
                return value;
            case '%':
                value /= 100;
                break;
        }
        return size * value;
    }
    const numberOrZero = (v)=>+v || 0;
    function _readValueToProps(value, props) {
        const ret = {};
        const objProps = isObject(props);
        const keys = objProps ? Object.keys(props) : props;
        const read = isObject(value) ? objProps ? (prop)=>valueOrDefault(value[prop], value[props[prop]]) : (prop)=>value[prop] : ()=>value;
        for (const prop of keys){
            ret[prop] = numberOrZero(read(prop));
        }
        return ret;
    }
    /**
     * Converts the given value into a TRBL object.
     * @param value - If a number, set the value to all TRBL component,
     *  else, if an object, use defined properties and sets undefined ones to 0.
     *  x / y are shorthands for same value for left/right and top/bottom.
     * @returns The padding values (top, right, bottom, left)
     * @since 3.0.0
     */ function toTRBL(value) {
        return _readValueToProps(value, {
            top: 'y',
            right: 'x',
            bottom: 'y',
            left: 'x'
        });
    }
    /**
     * Converts the given value into a TRBL corners object (similar with css border-radius).
     * @param value - If a number, set the value to all TRBL corner components,
     *  else, if an object, use defined properties and sets undefined ones to 0.
     * @returns The TRBL corner values (topLeft, topRight, bottomLeft, bottomRight)
     * @since 3.0.0
     */ function toTRBLCorners(value) {
        return _readValueToProps(value, [
            'topLeft',
            'topRight',
            'bottomLeft',
            'bottomRight'
        ]);
    }
    /**
     * Converts the given value into a padding object with pre-computed width/height.
     * @param value - If a number, set the value to all TRBL component,
     *  else, if an object, use defined properties and sets undefined ones to 0.
     *  x / y are shorthands for same value for left/right and top/bottom.
     * @returns The padding values (top, right, bottom, left, width, height)
     * @since 2.7.0
     */ function toPadding(value) {
        const obj = toTRBL(value);
        obj.width = obj.left + obj.right;
        obj.height = obj.top + obj.bottom;
        return obj;
    }
    /**
     * Parses font options and returns the font object.
     * @param options - A object that contains font options to be parsed.
     * @param fallback - A object that contains fallback font options.
     * @return The font object.
     * @private
     */ function toFont(options, fallback) {
        options = options || {};
        fallback = fallback || defaults.font;
        let size = valueOrDefault(options.size, fallback.size);
        if (typeof size === 'string') {
            size = parseInt(size, 10);
        }
        let style = valueOrDefault(options.style, fallback.style);
        if (style && !('' + style).match(FONT_STYLE)) {
            console.warn('Invalid font style specified: "' + style + '"');
            style = undefined;
        }
        const font = {
            family: valueOrDefault(options.family, fallback.family),
            lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
            size,
            style,
            weight: valueOrDefault(options.weight, fallback.weight),
            string: ''
        };
        font.string = toFontString(font);
        return font;
    }
    /**
     * Evaluates the given `inputs` sequentially and returns the first defined value.
     * @param inputs - An array of values, falling back to the last value.
     * @param context - If defined and the current value is a function, the value
     * is called with `context` as first argument and the result becomes the new input.
     * @param index - If defined and the current value is an array, the value
     * at `index` become the new input.
     * @param info - object to return information about resolution in
     * @param info.cacheable - Will be set to `false` if option is not cacheable.
     * @since 2.7.0
     */ function resolve(inputs, context, index, info) {
        let cacheable = true;
        let i, ilen, value;
        for(i = 0, ilen = inputs.length; i < ilen; ++i){
            value = inputs[i];
            if (value === undefined) {
                continue;
            }
            if (context !== undefined && typeof value === 'function') {
                value = value(context);
                cacheable = false;
            }
            if (index !== undefined && isArray(value)) {
                value = value[index % value.length];
                cacheable = false;
            }
            if (value !== undefined) {
                if (info && !cacheable) {
                    info.cacheable = false;
                }
                return value;
            }
        }
    }
    /**
     * @param minmax
     * @param grace
     * @param beginAtZero
     * @private
     */ function _addGrace(minmax, grace, beginAtZero) {
        const { min , max  } = minmax;
        const change = toDimension(grace, (max - min) / 2);
        const keepZero = (value, add)=>beginAtZero && value === 0 ? 0 : value + add;
        return {
            min: keepZero(min, -Math.abs(change)),
            max: keepZero(max, change)
        };
    }
    function createContext(parentContext, context) {
        return Object.assign(Object.create(parentContext), context);
    }

    /**
     * Creates a Proxy for resolving raw values for options.
     * @param scopes - The option scopes to look for values, in resolution order
     * @param prefixes - The prefixes for values, in resolution order.
     * @param rootScopes - The root option scopes
     * @param fallback - Parent scopes fallback
     * @param getTarget - callback for getting the target for changed values
     * @returns Proxy
     * @private
     */ function _createResolver(scopes, prefixes = [
        ''
    ], rootScopes, fallback, getTarget = ()=>scopes[0]) {
        const finalRootScopes = rootScopes || scopes;
        if (typeof fallback === 'undefined') {
            fallback = _resolve('_fallback', scopes);
        }
        const cache = {
            [Symbol.toStringTag]: 'Object',
            _cacheable: true,
            _scopes: scopes,
            _rootScopes: finalRootScopes,
            _fallback: fallback,
            _getTarget: getTarget,
            override: (scope)=>_createResolver([
                    scope,
                    ...scopes
                ], prefixes, finalRootScopes, fallback)
        };
        return new Proxy(cache, {
            /**
         * A trap for the delete operator.
         */ deleteProperty (target, prop) {
                delete target[prop]; // remove from cache
                delete target._keys; // remove cached keys
                delete scopes[0][prop]; // remove from top level scope
                return true;
            },
            /**
         * A trap for getting property values.
         */ get (target, prop) {
                return _cached(target, prop, ()=>_resolveWithPrefixes(prop, prefixes, scopes, target));
            },
            /**
         * A trap for Object.getOwnPropertyDescriptor.
         * Also used by Object.hasOwnProperty.
         */ getOwnPropertyDescriptor (target, prop) {
                return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
            },
            /**
         * A trap for Object.getPrototypeOf.
         */ getPrototypeOf () {
                return Reflect.getPrototypeOf(scopes[0]);
            },
            /**
         * A trap for the in operator.
         */ has (target, prop) {
                return getKeysFromAllScopes(target).includes(prop);
            },
            /**
         * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
         */ ownKeys (target) {
                return getKeysFromAllScopes(target);
            },
            /**
         * A trap for setting property values.
         */ set (target, prop, value) {
                const storage = target._storage || (target._storage = getTarget());
                target[prop] = storage[prop] = value; // set to top level scope + cache
                delete target._keys; // remove cached keys
                return true;
            }
        });
    }
    /**
     * Returns an Proxy for resolving option values with context.
     * @param proxy - The Proxy returned by `_createResolver`
     * @param context - Context object for scriptable/indexable options
     * @param subProxy - The proxy provided for scriptable options
     * @param descriptorDefaults - Defaults for descriptors
     * @private
     */ function _attachContext(proxy, context, subProxy, descriptorDefaults) {
        const cache = {
            _cacheable: false,
            _proxy: proxy,
            _context: context,
            _subProxy: subProxy,
            _stack: new Set(),
            _descriptors: _descriptors(proxy, descriptorDefaults),
            setContext: (ctx)=>_attachContext(proxy, ctx, subProxy, descriptorDefaults),
            override: (scope)=>_attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
        };
        return new Proxy(cache, {
            /**
         * A trap for the delete operator.
         */ deleteProperty (target, prop) {
                delete target[prop]; // remove from cache
                delete proxy[prop]; // remove from proxy
                return true;
            },
            /**
         * A trap for getting property values.
         */ get (target, prop, receiver) {
                return _cached(target, prop, ()=>_resolveWithContext(target, prop, receiver));
            },
            /**
         * A trap for Object.getOwnPropertyDescriptor.
         * Also used by Object.hasOwnProperty.
         */ getOwnPropertyDescriptor (target, prop) {
                return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
                    enumerable: true,
                    configurable: true
                } : undefined : Reflect.getOwnPropertyDescriptor(proxy, prop);
            },
            /**
         * A trap for Object.getPrototypeOf.
         */ getPrototypeOf () {
                return Reflect.getPrototypeOf(proxy);
            },
            /**
         * A trap for the in operator.
         */ has (target, prop) {
                return Reflect.has(proxy, prop);
            },
            /**
         * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
         */ ownKeys () {
                return Reflect.ownKeys(proxy);
            },
            /**
         * A trap for setting property values.
         */ set (target, prop, value) {
                proxy[prop] = value; // set to proxy
                delete target[prop]; // remove from cache
                return true;
            }
        });
    }
    /**
     * @private
     */ function _descriptors(proxy, defaults = {
        scriptable: true,
        indexable: true
    }) {
        const { _scriptable =defaults.scriptable , _indexable =defaults.indexable , _allKeys =defaults.allKeys  } = proxy;
        return {
            allKeys: _allKeys,
            scriptable: _scriptable,
            indexable: _indexable,
            isScriptable: isFunction(_scriptable) ? _scriptable : ()=>_scriptable,
            isIndexable: isFunction(_indexable) ? _indexable : ()=>_indexable
        };
    }
    const readKey = (prefix, name)=>prefix ? prefix + _capitalize(name) : name;
    const needsSubResolver = (prop, value)=>isObject(value) && prop !== 'adapters' && (Object.getPrototypeOf(value) === null || value.constructor === Object);
    function _cached(target, prop, resolve) {
        if (Object.prototype.hasOwnProperty.call(target, prop)) {
            return target[prop];
        }
        const value = resolve();
        // cache the resolved value
        target[prop] = value;
        return value;
    }
    function _resolveWithContext(target, prop, receiver) {
        const { _proxy , _context , _subProxy , _descriptors: descriptors  } = target;
        let value = _proxy[prop]; // resolve from proxy
        // resolve with context
        if (isFunction(value) && descriptors.isScriptable(prop)) {
            value = _resolveScriptable(prop, value, target, receiver);
        }
        if (isArray(value) && value.length) {
            value = _resolveArray(prop, value, target, descriptors.isIndexable);
        }
        if (needsSubResolver(prop, value)) {
            // if the resolved value is an object, create a sub resolver for it
            value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors);
        }
        return value;
    }
    function _resolveScriptable(prop, getValue, target, receiver) {
        const { _proxy , _context , _subProxy , _stack  } = target;
        if (_stack.has(prop)) {
            throw new Error('Recursion detected: ' + Array.from(_stack).join('->') + '->' + prop);
        }
        _stack.add(prop);
        let value = getValue(_context, _subProxy || receiver);
        _stack.delete(prop);
        if (needsSubResolver(prop, value)) {
            // When scriptable option returns an object, create a resolver on that.
            value = createSubResolver(_proxy._scopes, _proxy, prop, value);
        }
        return value;
    }
    function _resolveArray(prop, value, target, isIndexable) {
        const { _proxy , _context , _subProxy , _descriptors: descriptors  } = target;
        if (typeof _context.index !== 'undefined' && isIndexable(prop)) {
            return value[_context.index % value.length];
        } else if (isObject(value[0])) {
            // Array of objects, return array or resolvers
            const arr = value;
            const scopes = _proxy._scopes.filter((s)=>s !== arr);
            value = [];
            for (const item of arr){
                const resolver = createSubResolver(scopes, _proxy, prop, item);
                value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors));
            }
        }
        return value;
    }
    function resolveFallback(fallback, prop, value) {
        return isFunction(fallback) ? fallback(prop, value) : fallback;
    }
    const getScope = (key, parent)=>key === true ? parent : typeof key === 'string' ? resolveObjectKey(parent, key) : undefined;
    function addScopes(set, parentScopes, key, parentFallback, value) {
        for (const parent of parentScopes){
            const scope = getScope(key, parent);
            if (scope) {
                set.add(scope);
                const fallback = resolveFallback(scope._fallback, key, value);
                if (typeof fallback !== 'undefined' && fallback !== key && fallback !== parentFallback) {
                    // When we reach the descriptor that defines a new _fallback, return that.
                    // The fallback will resume to that new scope.
                    return fallback;
                }
            } else if (scope === false && typeof parentFallback !== 'undefined' && key !== parentFallback) {
                // Fallback to `false` results to `false`, when falling back to different key.
                // For example `interaction` from `hover` or `plugins.tooltip` and `animation` from `animations`
                return null;
            }
        }
        return false;
    }
    function createSubResolver(parentScopes, resolver, prop, value) {
        const rootScopes = resolver._rootScopes;
        const fallback = resolveFallback(resolver._fallback, prop, value);
        const allScopes = [
            ...parentScopes,
            ...rootScopes
        ];
        const set = new Set();
        set.add(value);
        let key = addScopesFromKey(set, allScopes, prop, fallback || prop, value);
        if (key === null) {
            return false;
        }
        if (typeof fallback !== 'undefined' && fallback !== prop) {
            key = addScopesFromKey(set, allScopes, fallback, key, value);
            if (key === null) {
                return false;
            }
        }
        return _createResolver(Array.from(set), [
            ''
        ], rootScopes, fallback, ()=>subGetTarget(resolver, prop, value));
    }
    function addScopesFromKey(set, allScopes, key, fallback, item) {
        while(key){
            key = addScopes(set, allScopes, key, fallback, item);
        }
        return key;
    }
    function subGetTarget(resolver, prop, value) {
        const parent = resolver._getTarget();
        if (!(prop in parent)) {
            parent[prop] = {};
        }
        const target = parent[prop];
        if (isArray(target) && isObject(value)) {
            // For array of objects, the object is used to store updated values
            return value;
        }
        return target || {};
    }
    function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
        let value;
        for (const prefix of prefixes){
            value = _resolve(readKey(prefix, prop), scopes);
            if (typeof value !== 'undefined') {
                return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
            }
        }
    }
    function _resolve(key, scopes) {
        for (const scope of scopes){
            if (!scope) {
                continue;
            }
            const value = scope[key];
            if (typeof value !== 'undefined') {
                return value;
            }
        }
    }
    function getKeysFromAllScopes(target) {
        let keys = target._keys;
        if (!keys) {
            keys = target._keys = resolveKeysFromAllScopes(target._scopes);
        }
        return keys;
    }
    function resolveKeysFromAllScopes(scopes) {
        const set = new Set();
        for (const scope of scopes){
            for (const key of Object.keys(scope).filter((k)=>!k.startsWith('_'))){
                set.add(key);
            }
        }
        return Array.from(set);
    }
    function _parseObjectDataRadialScale(meta, data, start, count) {
        const { iScale  } = meta;
        const { key ='r'  } = this._parsing;
        const parsed = new Array(count);
        let i, ilen, index, item;
        for(i = 0, ilen = count; i < ilen; ++i){
            index = i + start;
            item = data[index];
            parsed[i] = {
                r: iScale.parse(resolveObjectKey(item, key), index)
            };
        }
        return parsed;
    }

    const EPSILON = Number.EPSILON || 1e-14;
    const getPoint = (points, i)=>i < points.length && !points[i].skip && points[i];
    const getValueAxis = (indexAxis)=>indexAxis === 'x' ? 'y' : 'x';
    function splineCurve(firstPoint, middlePoint, afterPoint, t) {
        // Props to Rob Spencer at scaled innovation for his post on splining between points
        // http://scaledinnovation.com/analytics/splines/aboutSplines.html
        // This function must also respect "skipped" points
        const previous = firstPoint.skip ? middlePoint : firstPoint;
        const current = middlePoint;
        const next = afterPoint.skip ? middlePoint : afterPoint;
        const d01 = distanceBetweenPoints(current, previous);
        const d12 = distanceBetweenPoints(next, current);
        let s01 = d01 / (d01 + d12);
        let s12 = d12 / (d01 + d12);
        // If all points are the same, s01 & s02 will be inf
        s01 = isNaN(s01) ? 0 : s01;
        s12 = isNaN(s12) ? 0 : s12;
        const fa = t * s01; // scaling factor for triangle Ta
        const fb = t * s12;
        return {
            previous: {
                x: current.x - fa * (next.x - previous.x),
                y: current.y - fa * (next.y - previous.y)
            },
            next: {
                x: current.x + fb * (next.x - previous.x),
                y: current.y + fb * (next.y - previous.y)
            }
        };
    }
    /**
     * Adjust tangents to ensure monotonic properties
     */ function monotoneAdjust(points, deltaK, mK) {
        const pointsLen = points.length;
        let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
        let pointAfter = getPoint(points, 0);
        for(let i = 0; i < pointsLen - 1; ++i){
            pointCurrent = pointAfter;
            pointAfter = getPoint(points, i + 1);
            if (!pointCurrent || !pointAfter) {
                continue;
            }
            if (almostEquals(deltaK[i], 0, EPSILON)) {
                mK[i] = mK[i + 1] = 0;
                continue;
            }
            alphaK = mK[i] / deltaK[i];
            betaK = mK[i + 1] / deltaK[i];
            squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
            if (squaredMagnitude <= 9) {
                continue;
            }
            tauK = 3 / Math.sqrt(squaredMagnitude);
            mK[i] = alphaK * tauK * deltaK[i];
            mK[i + 1] = betaK * tauK * deltaK[i];
        }
    }
    function monotoneCompute(points, mK, indexAxis = 'x') {
        const valueAxis = getValueAxis(indexAxis);
        const pointsLen = points.length;
        let delta, pointBefore, pointCurrent;
        let pointAfter = getPoint(points, 0);
        for(let i = 0; i < pointsLen; ++i){
            pointBefore = pointCurrent;
            pointCurrent = pointAfter;
            pointAfter = getPoint(points, i + 1);
            if (!pointCurrent) {
                continue;
            }
            const iPixel = pointCurrent[indexAxis];
            const vPixel = pointCurrent[valueAxis];
            if (pointBefore) {
                delta = (iPixel - pointBefore[indexAxis]) / 3;
                pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
                pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
            }
            if (pointAfter) {
                delta = (pointAfter[indexAxis] - iPixel) / 3;
                pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
                pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
            }
        }
    }
    /**
     * This function calculates Bézier control points in a similar way than |splineCurve|,
     * but preserves monotonicity of the provided data and ensures no local extremums are added
     * between the dataset discrete points due to the interpolation.
     * See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation
     */ function splineCurveMonotone(points, indexAxis = 'x') {
        const valueAxis = getValueAxis(indexAxis);
        const pointsLen = points.length;
        const deltaK = Array(pointsLen).fill(0);
        const mK = Array(pointsLen);
        // Calculate slopes (deltaK) and initialize tangents (mK)
        let i, pointBefore, pointCurrent;
        let pointAfter = getPoint(points, 0);
        for(i = 0; i < pointsLen; ++i){
            pointBefore = pointCurrent;
            pointCurrent = pointAfter;
            pointAfter = getPoint(points, i + 1);
            if (!pointCurrent) {
                continue;
            }
            if (pointAfter) {
                const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
                // In the case of two points that appear at the same x pixel, slopeDeltaX is 0
                deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
            }
            mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
        }
        monotoneAdjust(points, deltaK, mK);
        monotoneCompute(points, mK, indexAxis);
    }
    function capControlPoint(pt, min, max) {
        return Math.max(Math.min(pt, max), min);
    }
    function capBezierPoints(points, area) {
        let i, ilen, point, inArea, inAreaPrev;
        let inAreaNext = _isPointInArea(points[0], area);
        for(i = 0, ilen = points.length; i < ilen; ++i){
            inAreaPrev = inArea;
            inArea = inAreaNext;
            inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
            if (!inArea) {
                continue;
            }
            point = points[i];
            if (inAreaPrev) {
                point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
                point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
            }
            if (inAreaNext) {
                point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
                point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
            }
        }
    }
    /**
     * @private
     */ function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
        let i, ilen, point, controlPoints;
        // Only consider points that are drawn in case the spanGaps option is used
        if (options.spanGaps) {
            points = points.filter((pt)=>!pt.skip);
        }
        if (options.cubicInterpolationMode === 'monotone') {
            splineCurveMonotone(points, indexAxis);
        } else {
            let prev = loop ? points[points.length - 1] : points[0];
            for(i = 0, ilen = points.length; i < ilen; ++i){
                point = points[i];
                controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
                point.cp1x = controlPoints.previous.x;
                point.cp1y = controlPoints.previous.y;
                point.cp2x = controlPoints.next.x;
                point.cp2y = controlPoints.next.y;
                prev = point;
            }
        }
        if (options.capBezierPoints) {
            capBezierPoints(points, area);
        }
    }

    /**
     * Note: typedefs are auto-exported, so use a made-up `dom` namespace where
     * necessary to avoid duplicates with `export * from './helpers`; see
     * https://github.com/microsoft/TypeScript/issues/46011
     * @typedef { import('../core/core.controller.js').default } dom.Chart
     * @typedef { import('../../types').ChartEvent } ChartEvent
     */ /**
     * @private
     */ function _isDomSupported() {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
    /**
     * @private
     */ function _getParentNode(domNode) {
        let parent = domNode.parentNode;
        if (parent && parent.toString() === '[object ShadowRoot]') {
            parent = parent.host;
        }
        return parent;
    }
    /**
     * convert max-width/max-height values that may be percentages into a number
     * @private
     */ function parseMaxStyle(styleValue, node, parentProperty) {
        let valueInPixels;
        if (typeof styleValue === 'string') {
            valueInPixels = parseInt(styleValue, 10);
            if (styleValue.indexOf('%') !== -1) {
                // percentage * size in dimension
                valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
            }
        } else {
            valueInPixels = styleValue;
        }
        return valueInPixels;
    }
    const getComputedStyle = (element)=>element.ownerDocument.defaultView.getComputedStyle(element, null);
    function getStyle(el, property) {
        return getComputedStyle(el).getPropertyValue(property);
    }
    const positions = [
        'top',
        'right',
        'bottom',
        'left'
    ];
    function getPositionedStyle(styles, style, suffix) {
        const result = {};
        suffix = suffix ? '-' + suffix : '';
        for(let i = 0; i < 4; i++){
            const pos = positions[i];
            result[pos] = parseFloat(styles[style + '-' + pos + suffix]) || 0;
        }
        result.width = result.left + result.right;
        result.height = result.top + result.bottom;
        return result;
    }
    const useOffsetPos = (x, y, target)=>(x > 0 || y > 0) && (!target || !target.shadowRoot);
    /**
     * @param e
     * @param canvas
     * @returns Canvas position
     */ function getCanvasPosition(e, canvas) {
        const touches = e.touches;
        const source = touches && touches.length ? touches[0] : e;
        const { offsetX , offsetY  } = source;
        let box = false;
        let x, y;
        if (useOffsetPos(offsetX, offsetY, e.target)) {
            x = offsetX;
            y = offsetY;
        } else {
            const rect = canvas.getBoundingClientRect();
            x = source.clientX - rect.left;
            y = source.clientY - rect.top;
            box = true;
        }
        return {
            x,
            y,
            box
        };
    }
    /**
     * Gets an event's x, y coordinates, relative to the chart area
     * @param event
     * @param chart
     * @returns x and y coordinates of the event
     */ function getRelativePosition(event, chart) {
        if ('native' in event) {
            return event;
        }
        const { canvas , currentDevicePixelRatio  } = chart;
        const style = getComputedStyle(canvas);
        const borderBox = style.boxSizing === 'border-box';
        const paddings = getPositionedStyle(style, 'padding');
        const borders = getPositionedStyle(style, 'border', 'width');
        const { x , y , box  } = getCanvasPosition(event, canvas);
        const xOffset = paddings.left + (box && borders.left);
        const yOffset = paddings.top + (box && borders.top);
        let { width , height  } = chart;
        if (borderBox) {
            width -= paddings.width + borders.width;
            height -= paddings.height + borders.height;
        }
        return {
            x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
            y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
        };
    }
    function getContainerSize(canvas, width, height) {
        let maxWidth, maxHeight;
        if (width === undefined || height === undefined) {
            const container = _getParentNode(canvas);
            if (!container) {
                width = canvas.clientWidth;
                height = canvas.clientHeight;
            } else {
                const rect = container.getBoundingClientRect(); // this is the border box of the container
                const containerStyle = getComputedStyle(container);
                const containerBorder = getPositionedStyle(containerStyle, 'border', 'width');
                const containerPadding = getPositionedStyle(containerStyle, 'padding');
                width = rect.width - containerPadding.width - containerBorder.width;
                height = rect.height - containerPadding.height - containerBorder.height;
                maxWidth = parseMaxStyle(containerStyle.maxWidth, container, 'clientWidth');
                maxHeight = parseMaxStyle(containerStyle.maxHeight, container, 'clientHeight');
            }
        }
        return {
            width,
            height,
            maxWidth: maxWidth || INFINITY,
            maxHeight: maxHeight || INFINITY
        };
    }
    const round1 = (v)=>Math.round(v * 10) / 10;
    // eslint-disable-next-line complexity
    function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
        const style = getComputedStyle(canvas);
        const margins = getPositionedStyle(style, 'margin');
        const maxWidth = parseMaxStyle(style.maxWidth, canvas, 'clientWidth') || INFINITY;
        const maxHeight = parseMaxStyle(style.maxHeight, canvas, 'clientHeight') || INFINITY;
        const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
        let { width , height  } = containerSize;
        if (style.boxSizing === 'content-box') {
            const borders = getPositionedStyle(style, 'border', 'width');
            const paddings = getPositionedStyle(style, 'padding');
            width -= paddings.width + borders.width;
            height -= paddings.height + borders.height;
        }
        width = Math.max(0, width - margins.width);
        height = Math.max(0, aspectRatio ? width / aspectRatio : height - margins.height);
        width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
        height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
        if (width && !height) {
            // https://github.com/chartjs/Chart.js/issues/4659
            // If the canvas has width, but no height, default to aspectRatio of 2 (canvas default)
            height = round1(width / 2);
        }
        const maintainHeight = bbWidth !== undefined || bbHeight !== undefined;
        if (maintainHeight && aspectRatio && containerSize.height && height > containerSize.height) {
            height = containerSize.height;
            width = round1(Math.floor(height * aspectRatio));
        }
        return {
            width,
            height
        };
    }
    /**
     * @param chart
     * @param forceRatio
     * @param forceStyle
     * @returns True if the canvas context size or transformation has changed.
     */ function retinaScale(chart, forceRatio, forceStyle) {
        const pixelRatio = forceRatio || 1;
        const deviceHeight = Math.floor(chart.height * pixelRatio);
        const deviceWidth = Math.floor(chart.width * pixelRatio);
        chart.height = Math.floor(chart.height);
        chart.width = Math.floor(chart.width);
        const canvas = chart.canvas;
        // If no style has been set on the canvas, the render size is used as display size,
        // making the chart visually bigger, so let's enforce it to the "correct" values.
        // See https://github.com/chartjs/Chart.js/issues/3575
        if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
            canvas.style.height = `${chart.height}px`;
            canvas.style.width = `${chart.width}px`;
        }
        if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== deviceHeight || canvas.width !== deviceWidth) {
            chart.currentDevicePixelRatio = pixelRatio;
            canvas.height = deviceHeight;
            canvas.width = deviceWidth;
            chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            return true;
        }
        return false;
    }
    /**
     * Detects support for options object argument in addEventListener.
     * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
     * @private
     */ const supportsEventListenerOptions = function() {
        let passiveSupported = false;
        try {
            const options = {
                get passive () {
                    passiveSupported = true;
                    return false;
                }
            };
            if (_isDomSupported()) {
                window.addEventListener('test', null, options);
                window.removeEventListener('test', null, options);
            }
        } catch (e) {
        // continue regardless of error
        }
        return passiveSupported;
    }();
    /**
     * The "used" size is the final value of a dimension property after all calculations have
     * been performed. This method uses the computed style of `element` but returns undefined
     * if the computed style is not expressed in pixels. That can happen in some cases where
     * `element` has a size relative to its parent and this last one is not yet displayed,
     * for example because of `display: none` on a parent node.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
     * @returns Size in pixels or undefined if unknown.
     */ function readUsedSize(element, property) {
        const value = getStyle(element, property);
        const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
        return matches ? +matches[1] : undefined;
    }

    /**
     * @private
     */ function _pointInLine(p1, p2, t, mode) {
        return {
            x: p1.x + t * (p2.x - p1.x),
            y: p1.y + t * (p2.y - p1.y)
        };
    }
    /**
     * @private
     */ function _steppedInterpolation(p1, p2, t, mode) {
        return {
            x: p1.x + t * (p2.x - p1.x),
            y: mode === 'middle' ? t < 0.5 ? p1.y : p2.y : mode === 'after' ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
        };
    }
    /**
     * @private
     */ function _bezierInterpolation(p1, p2, t, mode) {
        const cp1 = {
            x: p1.cp2x,
            y: p1.cp2y
        };
        const cp2 = {
            x: p2.cp1x,
            y: p2.cp1y
        };
        const a = _pointInLine(p1, cp1, t);
        const b = _pointInLine(cp1, cp2, t);
        const c = _pointInLine(cp2, p2, t);
        const d = _pointInLine(a, b, t);
        const e = _pointInLine(b, c, t);
        return _pointInLine(d, e, t);
    }

    const getRightToLeftAdapter = function(rectX, width) {
        return {
            x (x) {
                return rectX + rectX + width - x;
            },
            setWidth (w) {
                width = w;
            },
            textAlign (align) {
                if (align === 'center') {
                    return align;
                }
                return align === 'right' ? 'left' : 'right';
            },
            xPlus (x, value) {
                return x - value;
            },
            leftForLtr (x, itemWidth) {
                return x - itemWidth;
            }
        };
    };
    const getLeftToRightAdapter = function() {
        return {
            x (x) {
                return x;
            },
            setWidth (w) {},
            textAlign (align) {
                return align;
            },
            xPlus (x, value) {
                return x + value;
            },
            leftForLtr (x, _itemWidth) {
                return x;
            }
        };
    };
    function getRtlAdapter(rtl, rectX, width) {
        return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
    }
    function overrideTextDirection(ctx, direction) {
        let style, original;
        if (direction === 'ltr' || direction === 'rtl') {
            style = ctx.canvas.style;
            original = [
                style.getPropertyValue('direction'),
                style.getPropertyPriority('direction')
            ];
            style.setProperty('direction', direction, 'important');
            ctx.prevTextDirection = original;
        }
    }
    function restoreTextDirection(ctx, original) {
        if (original !== undefined) {
            delete ctx.prevTextDirection;
            ctx.canvas.style.setProperty('direction', original[0], original[1]);
        }
    }

    function propertyFn(property) {
        if (property === 'angle') {
            return {
                between: _angleBetween,
                compare: _angleDiff,
                normalize: _normalizeAngle
            };
        }
        return {
            between: _isBetween,
            compare: (a, b)=>a - b,
            normalize: (x)=>x
        };
    }
    function normalizeSegment({ start , end , count , loop , style  }) {
        return {
            start: start % count,
            end: end % count,
            loop: loop && (end - start + 1) % count === 0,
            style
        };
    }
    function getSegment(segment, points, bounds) {
        const { property , start: startBound , end: endBound  } = bounds;
        const { between , normalize  } = propertyFn(property);
        const count = points.length;
        let { start , end , loop  } = segment;
        let i, ilen;
        if (loop) {
            start += count;
            end += count;
            for(i = 0, ilen = count; i < ilen; ++i){
                if (!between(normalize(points[start % count][property]), startBound, endBound)) {
                    break;
                }
                start--;
                end--;
            }
            start %= count;
            end %= count;
        }
        if (end < start) {
            end += count;
        }
        return {
            start,
            end,
            loop,
            style: segment.style
        };
    }
     function _boundSegment(segment, points, bounds) {
        if (!bounds) {
            return [
                segment
            ];
        }
        const { property , start: startBound , end: endBound  } = bounds;
        const count = points.length;
        const { compare , between , normalize  } = propertyFn(property);
        const { start , end , loop , style  } = getSegment(segment, points, bounds);
        const result = [];
        let inside = false;
        let subStart = null;
        let value, point, prevValue;
        const startIsBefore = ()=>between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
        const endIsBefore = ()=>compare(endBound, value) === 0 || between(endBound, prevValue, value);
        const shouldStart = ()=>inside || startIsBefore();
        const shouldStop = ()=>!inside || endIsBefore();
        for(let i = start, prev = start; i <= end; ++i){
            point = points[i % count];
            if (point.skip) {
                continue;
            }
            value = normalize(point[property]);
            if (value === prevValue) {
                continue;
            }
            inside = between(value, startBound, endBound);
            if (subStart === null && shouldStart()) {
                subStart = compare(value, startBound) === 0 ? i : prev;
            }
            if (subStart !== null && shouldStop()) {
                result.push(normalizeSegment({
                    start: subStart,
                    end: i,
                    loop,
                    count,
                    style
                }));
                subStart = null;
            }
            prev = i;
            prevValue = value;
        }
        if (subStart !== null) {
            result.push(normalizeSegment({
                start: subStart,
                end,
                loop,
                count,
                style
            }));
        }
        return result;
    }
     function _boundSegments(line, bounds) {
        const result = [];
        const segments = line.segments;
        for(let i = 0; i < segments.length; i++){
            const sub = _boundSegment(segments[i], line.points, bounds);
            if (sub.length) {
                result.push(...sub);
            }
        }
        return result;
    }
     function findStartAndEnd(points, count, loop, spanGaps) {
        let start = 0;
        let end = count - 1;
        if (loop && !spanGaps) {
            while(start < count && !points[start].skip){
                start++;
            }
        }
        while(start < count && points[start].skip){
            start++;
        }
        start %= count;
        if (loop) {
            end += start;
        }
        while(end > start && points[end % count].skip){
            end--;
        }
        end %= count;
        return {
            start,
            end
        };
    }
     function solidSegments(points, start, max, loop) {
        const count = points.length;
        const result = [];
        let last = start;
        let prev = points[start];
        let end;
        for(end = start + 1; end <= max; ++end){
            const cur = points[end % count];
            if (cur.skip || cur.stop) {
                if (!prev.skip) {
                    loop = false;
                    result.push({
                        start: start % count,
                        end: (end - 1) % count,
                        loop
                    });
                    start = last = cur.stop ? end : null;
                }
            } else {
                last = end;
                if (prev.skip) {
                    start = end;
                }
            }
            prev = cur;
        }
        if (last !== null) {
            result.push({
                start: start % count,
                end: last % count,
                loop
            });
        }
        return result;
    }
     function _computeSegments(line, segmentOptions) {
        const points = line.points;
        const spanGaps = line.options.spanGaps;
        const count = points.length;
        if (!count) {
            return [];
        }
        const loop = !!line._loop;
        const { start , end  } = findStartAndEnd(points, count, loop, spanGaps);
        if (spanGaps === true) {
            return splitByStyles(line, [
                {
                    start,
                    end,
                    loop
                }
            ], points, segmentOptions);
        }
        const max = end < start ? end + count : end;
        const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
        return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
    }
     function splitByStyles(line, segments, points, segmentOptions) {
        if (!segmentOptions || !segmentOptions.setContext || !points) {
            return segments;
        }
        return doSplitByStyles(line, segments, points, segmentOptions);
    }
     function doSplitByStyles(line, segments, points, segmentOptions) {
        const chartContext = line._chart.getContext();
        const baseStyle = readStyle(line.options);
        const { _datasetIndex: datasetIndex , options: { spanGaps  }  } = line;
        const count = points.length;
        const result = [];
        let prevStyle = baseStyle;
        let start = segments[0].start;
        let i = start;
        function addStyle(s, e, l, st) {
            const dir = spanGaps ? -1 : 1;
            if (s === e) {
                return;
            }
            s += count;
            while(points[s % count].skip){
                s -= dir;
            }
            while(points[e % count].skip){
                e += dir;
            }
            if (s % count !== e % count) {
                result.push({
                    start: s % count,
                    end: e % count,
                    loop: l,
                    style: st
                });
                prevStyle = st;
                start = e % count;
            }
        }
        for (const segment of segments){
            start = spanGaps ? start : segment.start;
            let prev = points[start % count];
            let style;
            for(i = start + 1; i <= segment.end; i++){
                const pt = points[i % count];
                style = readStyle(segmentOptions.setContext(createContext(chartContext, {
                    type: 'segment',
                    p0: prev,
                    p1: pt,
                    p0DataIndex: (i - 1) % count,
                    p1DataIndex: i % count,
                    datasetIndex
                })));
                if (styleChanged(style, prevStyle)) {
                    addStyle(start, i - 1, segment.loop, prevStyle);
                }
                prev = pt;
                prevStyle = style;
            }
            if (start < i - 1) {
                addStyle(start, i - 1, segment.loop, prevStyle);
            }
        }
        return result;
    }
    function readStyle(options) {
        return {
            backgroundColor: options.backgroundColor,
            borderCapStyle: options.borderCapStyle,
            borderDash: options.borderDash,
            borderDashOffset: options.borderDashOffset,
            borderJoinStyle: options.borderJoinStyle,
            borderWidth: options.borderWidth,
            borderColor: options.borderColor
        };
    }
    function styleChanged(style, prevStyle) {
        if (!prevStyle) {
            return false;
        }
        const cache = [];
        const replacer = function(key, value) {
            if (!isPatternOrGradient(value)) {
                return value;
            }
            if (!cache.includes(value)) {
                cache.push(value);
            }
            return cache.indexOf(value);
        };
        return JSON.stringify(style, replacer) !== JSON.stringify(prevStyle, replacer);
    }

    /*!
     * Chart.js v4.4.2
     * https://www.chartjs.org
     * (c) 2024 Chart.js Contributors
     * Released under the MIT License
     */

    class Animator {
        constructor(){
            this._request = null;
            this._charts = new Map();
            this._running = false;
            this._lastDate = undefined;
        }
     _notify(chart, anims, date, type) {
            const callbacks = anims.listeners[type];
            const numSteps = anims.duration;
            callbacks.forEach((fn)=>fn({
                    chart,
                    initial: anims.initial,
                    numSteps,
                    currentStep: Math.min(date - anims.start, numSteps)
                }));
        }
     _refresh() {
            if (this._request) {
                return;
            }
            this._running = true;
            this._request = requestAnimFrame.call(window, ()=>{
                this._update();
                this._request = null;
                if (this._running) {
                    this._refresh();
                }
            });
        }
     _update(date = Date.now()) {
            let remaining = 0;
            this._charts.forEach((anims, chart)=>{
                if (!anims.running || !anims.items.length) {
                    return;
                }
                const items = anims.items;
                let i = items.length - 1;
                let draw = false;
                let item;
                for(; i >= 0; --i){
                    item = items[i];
                    if (item._active) {
                        if (item._total > anims.duration) {
                            anims.duration = item._total;
                        }
                        item.tick(date);
                        draw = true;
                    } else {
                        items[i] = items[items.length - 1];
                        items.pop();
                    }
                }
                if (draw) {
                    chart.draw();
                    this._notify(chart, anims, date, 'progress');
                }
                if (!items.length) {
                    anims.running = false;
                    this._notify(chart, anims, date, 'complete');
                    anims.initial = false;
                }
                remaining += items.length;
            });
            this._lastDate = date;
            if (remaining === 0) {
                this._running = false;
            }
        }
     _getAnims(chart) {
            const charts = this._charts;
            let anims = charts.get(chart);
            if (!anims) {
                anims = {
                    running: false,
                    initial: true,
                    items: [],
                    listeners: {
                        complete: [],
                        progress: []
                    }
                };
                charts.set(chart, anims);
            }
            return anims;
        }
     listen(chart, event, cb) {
            this._getAnims(chart).listeners[event].push(cb);
        }
     add(chart, items) {
            if (!items || !items.length) {
                return;
            }
            this._getAnims(chart).items.push(...items);
        }
     has(chart) {
            return this._getAnims(chart).items.length > 0;
        }
     start(chart) {
            const anims = this._charts.get(chart);
            if (!anims) {
                return;
            }
            anims.running = true;
            anims.start = Date.now();
            anims.duration = anims.items.reduce((acc, cur)=>Math.max(acc, cur._duration), 0);
            this._refresh();
        }
        running(chart) {
            if (!this._running) {
                return false;
            }
            const anims = this._charts.get(chart);
            if (!anims || !anims.running || !anims.items.length) {
                return false;
            }
            return true;
        }
     stop(chart) {
            const anims = this._charts.get(chart);
            if (!anims || !anims.items.length) {
                return;
            }
            const items = anims.items;
            let i = items.length - 1;
            for(; i >= 0; --i){
                items[i].cancel();
            }
            anims.items = [];
            this._notify(chart, anims, Date.now(), 'complete');
        }
     remove(chart) {
            return this._charts.delete(chart);
        }
    }
    var animator = /* #__PURE__ */ new Animator();

    const transparent = 'transparent';
    const interpolators = {
        boolean (from, to, factor) {
            return factor > 0.5 ? to : from;
        },
     color (from, to, factor) {
            const c0 = color(from || transparent);
            const c1 = c0.valid && color(to || transparent);
            return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to;
        },
        number (from, to, factor) {
            return from + (to - from) * factor;
        }
    };
    class Animation {
        constructor(cfg, target, prop, to){
            const currentValue = target[prop];
            to = resolve([
                cfg.to,
                to,
                currentValue,
                cfg.from
            ]);
            const from = resolve([
                cfg.from,
                currentValue,
                to
            ]);
            this._active = true;
            this._fn = cfg.fn || interpolators[cfg.type || typeof from];
            this._easing = effects[cfg.easing] || effects.linear;
            this._start = Math.floor(Date.now() + (cfg.delay || 0));
            this._duration = this._total = Math.floor(cfg.duration);
            this._loop = !!cfg.loop;
            this._target = target;
            this._prop = prop;
            this._from = from;
            this._to = to;
            this._promises = undefined;
        }
        active() {
            return this._active;
        }
        update(cfg, to, date) {
            if (this._active) {
                this._notify(false);
                const currentValue = this._target[this._prop];
                const elapsed = date - this._start;
                const remain = this._duration - elapsed;
                this._start = date;
                this._duration = Math.floor(Math.max(remain, cfg.duration));
                this._total += elapsed;
                this._loop = !!cfg.loop;
                this._to = resolve([
                    cfg.to,
                    to,
                    currentValue,
                    cfg.from
                ]);
                this._from = resolve([
                    cfg.from,
                    currentValue,
                    to
                ]);
            }
        }
        cancel() {
            if (this._active) {
                this.tick(Date.now());
                this._active = false;
                this._notify(false);
            }
        }
        tick(date) {
            const elapsed = date - this._start;
            const duration = this._duration;
            const prop = this._prop;
            const from = this._from;
            const loop = this._loop;
            const to = this._to;
            let factor;
            this._active = from !== to && (loop || elapsed < duration);
            if (!this._active) {
                this._target[prop] = to;
                this._notify(true);
                return;
            }
            if (elapsed < 0) {
                this._target[prop] = from;
                return;
            }
            factor = elapsed / duration % 2;
            factor = loop && factor > 1 ? 2 - factor : factor;
            factor = this._easing(Math.min(1, Math.max(0, factor)));
            this._target[prop] = this._fn(from, to, factor);
        }
        wait() {
            const promises = this._promises || (this._promises = []);
            return new Promise((res, rej)=>{
                promises.push({
                    res,
                    rej
                });
            });
        }
        _notify(resolved) {
            const method = resolved ? 'res' : 'rej';
            const promises = this._promises || [];
            for(let i = 0; i < promises.length; i++){
                promises[i][method]();
            }
        }
    }

    class Animations {
        constructor(chart, config){
            this._chart = chart;
            this._properties = new Map();
            this.configure(config);
        }
        configure(config) {
            if (!isObject(config)) {
                return;
            }
            const animationOptions = Object.keys(defaults.animation);
            const animatedProps = this._properties;
            Object.getOwnPropertyNames(config).forEach((key)=>{
                const cfg = config[key];
                if (!isObject(cfg)) {
                    return;
                }
                const resolved = {};
                for (const option of animationOptions){
                    resolved[option] = cfg[option];
                }
                (isArray(cfg.properties) && cfg.properties || [
                    key
                ]).forEach((prop)=>{
                    if (prop === key || !animatedProps.has(prop)) {
                        animatedProps.set(prop, resolved);
                    }
                });
            });
        }
     _animateOptions(target, values) {
            const newOptions = values.options;
            const options = resolveTargetOptions(target, newOptions);
            if (!options) {
                return [];
            }
            const animations = this._createAnimations(options, newOptions);
            if (newOptions.$shared) {
                awaitAll(target.options.$animations, newOptions).then(()=>{
                    target.options = newOptions;
                }, ()=>{
                });
            }
            return animations;
        }
     _createAnimations(target, values) {
            const animatedProps = this._properties;
            const animations = [];
            const running = target.$animations || (target.$animations = {});
            const props = Object.keys(values);
            const date = Date.now();
            let i;
            for(i = props.length - 1; i >= 0; --i){
                const prop = props[i];
                if (prop.charAt(0) === '$') {
                    continue;
                }
                if (prop === 'options') {
                    animations.push(...this._animateOptions(target, values));
                    continue;
                }
                const value = values[prop];
                let animation = running[prop];
                const cfg = animatedProps.get(prop);
                if (animation) {
                    if (cfg && animation.active()) {
                        animation.update(cfg, value, date);
                        continue;
                    } else {
                        animation.cancel();
                    }
                }
                if (!cfg || !cfg.duration) {
                    target[prop] = value;
                    continue;
                }
                running[prop] = animation = new Animation(cfg, target, prop, value);
                animations.push(animation);
            }
            return animations;
        }
     update(target, values) {
            if (this._properties.size === 0) {
                Object.assign(target, values);
                return;
            }
            const animations = this._createAnimations(target, values);
            if (animations.length) {
                animator.add(this._chart, animations);
                return true;
            }
        }
    }
    function awaitAll(animations, properties) {
        const running = [];
        const keys = Object.keys(properties);
        for(let i = 0; i < keys.length; i++){
            const anim = animations[keys[i]];
            if (anim && anim.active()) {
                running.push(anim.wait());
            }
        }
        return Promise.all(running);
    }
    function resolveTargetOptions(target, newOptions) {
        if (!newOptions) {
            return;
        }
        let options = target.options;
        if (!options) {
            target.options = newOptions;
            return;
        }
        if (options.$shared) {
            target.options = options = Object.assign({}, options, {
                $shared: false,
                $animations: {}
            });
        }
        return options;
    }

    function scaleClip(scale, allowedOverflow) {
        const opts = scale && scale.options || {};
        const reverse = opts.reverse;
        const min = opts.min === undefined ? allowedOverflow : 0;
        const max = opts.max === undefined ? allowedOverflow : 0;
        return {
            start: reverse ? max : min,
            end: reverse ? min : max
        };
    }
    function defaultClip(xScale, yScale, allowedOverflow) {
        if (allowedOverflow === false) {
            return false;
        }
        const x = scaleClip(xScale, allowedOverflow);
        const y = scaleClip(yScale, allowedOverflow);
        return {
            top: y.end,
            right: x.end,
            bottom: y.start,
            left: x.start
        };
    }
    function toClip(value) {
        let t, r, b, l;
        if (isObject(value)) {
            t = value.top;
            r = value.right;
            b = value.bottom;
            l = value.left;
        } else {
            t = r = b = l = value;
        }
        return {
            top: t,
            right: r,
            bottom: b,
            left: l,
            disabled: value === false
        };
    }
    function getSortedDatasetIndices(chart, filterVisible) {
        const keys = [];
        const metasets = chart._getSortedDatasetMetas(filterVisible);
        let i, ilen;
        for(i = 0, ilen = metasets.length; i < ilen; ++i){
            keys.push(metasets[i].index);
        }
        return keys;
    }
    function applyStack(stack, value, dsIndex, options = {}) {
        const keys = stack.keys;
        const singleMode = options.mode === 'single';
        let i, ilen, datasetIndex, otherValue;
        if (value === null) {
            return;
        }
        for(i = 0, ilen = keys.length; i < ilen; ++i){
            datasetIndex = +keys[i];
            if (datasetIndex === dsIndex) {
                if (options.all) {
                    continue;
                }
                break;
            }
            otherValue = stack.values[datasetIndex];
            if (isNumberFinite(otherValue) && (singleMode || value === 0 || sign(value) === sign(otherValue))) {
                value += otherValue;
            }
        }
        return value;
    }
    function convertObjectDataToArray(data) {
        const keys = Object.keys(data);
        const adata = new Array(keys.length);
        let i, ilen, key;
        for(i = 0, ilen = keys.length; i < ilen; ++i){
            key = keys[i];
            adata[i] = {
                x: key,
                y: data[key]
            };
        }
        return adata;
    }
    function isStacked(scale, meta) {
        const stacked = scale && scale.options.stacked;
        return stacked || stacked === undefined && meta.stack !== undefined;
    }
    function getStackKey(indexScale, valueScale, meta) {
        return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
    }
    function getUserBounds(scale) {
        const { min , max , minDefined , maxDefined  } = scale.getUserBounds();
        return {
            min: minDefined ? min : Number.NEGATIVE_INFINITY,
            max: maxDefined ? max : Number.POSITIVE_INFINITY
        };
    }
    function getOrCreateStack(stacks, stackKey, indexValue) {
        const subStack = stacks[stackKey] || (stacks[stackKey] = {});
        return subStack[indexValue] || (subStack[indexValue] = {});
    }
    function getLastIndexInStack(stack, vScale, positive, type) {
        for (const meta of vScale.getMatchingVisibleMetas(type).reverse()){
            const value = stack[meta.index];
            if (positive && value > 0 || !positive && value < 0) {
                return meta.index;
            }
        }
        return null;
    }
    function updateStacks(controller, parsed) {
        const { chart , _cachedMeta: meta  } = controller;
        const stacks = chart._stacks || (chart._stacks = {});
        const { iScale , vScale , index: datasetIndex  } = meta;
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        const key = getStackKey(iScale, vScale, meta);
        const ilen = parsed.length;
        let stack;
        for(let i = 0; i < ilen; ++i){
            const item = parsed[i];
            const { [iAxis]: index , [vAxis]: value  } = item;
            const itemStacks = item._stacks || (item._stacks = {});
            stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index);
            stack[datasetIndex] = value;
            stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
            stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
            const visualValues = stack._visualValues || (stack._visualValues = {});
            visualValues[datasetIndex] = value;
        }
    }
    function getFirstScaleId(chart, axis) {
        const scales = chart.scales;
        return Object.keys(scales).filter((key)=>scales[key].axis === axis).shift();
    }
    function createDatasetContext(parent, index) {
        return createContext(parent, {
            active: false,
            dataset: undefined,
            datasetIndex: index,
            index,
            mode: 'default',
            type: 'dataset'
        });
    }
    function createDataContext(parent, index, element) {
        return createContext(parent, {
            active: false,
            dataIndex: index,
            parsed: undefined,
            raw: undefined,
            element,
            index,
            mode: 'default',
            type: 'data'
        });
    }
    function clearStacks(meta, items) {
        const datasetIndex = meta.controller.index;
        const axis = meta.vScale && meta.vScale.axis;
        if (!axis) {
            return;
        }
        items = items || meta._parsed;
        for (const parsed of items){
            const stacks = parsed._stacks;
            if (!stacks || stacks[axis] === undefined || stacks[axis][datasetIndex] === undefined) {
                return;
            }
            delete stacks[axis][datasetIndex];
            if (stacks[axis]._visualValues !== undefined && stacks[axis]._visualValues[datasetIndex] !== undefined) {
                delete stacks[axis]._visualValues[datasetIndex];
            }
        }
    }
    const isDirectUpdateMode = (mode)=>mode === 'reset' || mode === 'none';
    const cloneIfNotShared = (cached, shared)=>shared ? cached : Object.assign({}, cached);
    const createStack = (canStack, meta, chart)=>canStack && !meta.hidden && meta._stacked && {
            keys: getSortedDatasetIndices(chart, true),
            values: null
        };
    class DatasetController {
     static defaults = {};
     static datasetElementType = null;
     static dataElementType = null;
     constructor(chart, datasetIndex){
            this.chart = chart;
            this._ctx = chart.ctx;
            this.index = datasetIndex;
            this._cachedDataOpts = {};
            this._cachedMeta = this.getMeta();
            this._type = this._cachedMeta.type;
            this.options = undefined;
             this._parsing = false;
            this._data = undefined;
            this._objectData = undefined;
            this._sharedOptions = undefined;
            this._drawStart = undefined;
            this._drawCount = undefined;
            this.enableOptionSharing = false;
            this.supportsDecimation = false;
            this.$context = undefined;
            this._syncList = [];
            this.datasetElementType = new.target.datasetElementType;
            this.dataElementType = new.target.dataElementType;
            this.initialize();
        }
        initialize() {
            const meta = this._cachedMeta;
            this.configure();
            this.linkScales();
            meta._stacked = isStacked(meta.vScale, meta);
            this.addElements();
            if (this.options.fill && !this.chart.isPluginEnabled('filler')) {
                console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
            }
        }
        updateIndex(datasetIndex) {
            if (this.index !== datasetIndex) {
                clearStacks(this._cachedMeta);
            }
            this.index = datasetIndex;
        }
        linkScales() {
            const chart = this.chart;
            const meta = this._cachedMeta;
            const dataset = this.getDataset();
            const chooseId = (axis, x, y, r)=>axis === 'x' ? x : axis === 'r' ? r : y;
            const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, 'x'));
            const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, 'y'));
            const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, 'r'));
            const indexAxis = meta.indexAxis;
            const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
            const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
            meta.xScale = this.getScaleForId(xid);
            meta.yScale = this.getScaleForId(yid);
            meta.rScale = this.getScaleForId(rid);
            meta.iScale = this.getScaleForId(iid);
            meta.vScale = this.getScaleForId(vid);
        }
        getDataset() {
            return this.chart.data.datasets[this.index];
        }
        getMeta() {
            return this.chart.getDatasetMeta(this.index);
        }
     getScaleForId(scaleID) {
            return this.chart.scales[scaleID];
        }
     _getOtherScale(scale) {
            const meta = this._cachedMeta;
            return scale === meta.iScale ? meta.vScale : meta.iScale;
        }
        reset() {
            this._update('reset');
        }
     _destroy() {
            const meta = this._cachedMeta;
            if (this._data) {
                unlistenArrayEvents(this._data, this);
            }
            if (meta._stacked) {
                clearStacks(meta);
            }
        }
     _dataCheck() {
            const dataset = this.getDataset();
            const data = dataset.data || (dataset.data = []);
            const _data = this._data;
            if (isObject(data)) {
                this._data = convertObjectDataToArray(data);
            } else if (_data !== data) {
                if (_data) {
                    unlistenArrayEvents(_data, this);
                    const meta = this._cachedMeta;
                    clearStacks(meta);
                    meta._parsed = [];
                }
                if (data && Object.isExtensible(data)) {
                    listenArrayEvents(data, this);
                }
                this._syncList = [];
                this._data = data;
            }
        }
        addElements() {
            const meta = this._cachedMeta;
            this._dataCheck();
            if (this.datasetElementType) {
                meta.dataset = new this.datasetElementType();
            }
        }
        buildOrUpdateElements(resetNewElements) {
            const meta = this._cachedMeta;
            const dataset = this.getDataset();
            let stackChanged = false;
            this._dataCheck();
            const oldStacked = meta._stacked;
            meta._stacked = isStacked(meta.vScale, meta);
            if (meta.stack !== dataset.stack) {
                stackChanged = true;
                clearStacks(meta);
                meta.stack = dataset.stack;
            }
            this._resyncElements(resetNewElements);
            if (stackChanged || oldStacked !== meta._stacked) {
                updateStacks(this, meta._parsed);
            }
        }
     configure() {
            const config = this.chart.config;
            const scopeKeys = config.datasetScopeKeys(this._type);
            const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
            this.options = config.createResolver(scopes, this.getContext());
            this._parsing = this.options.parsing;
            this._cachedDataOpts = {};
        }
     parse(start, count) {
            const { _cachedMeta: meta , _data: data  } = this;
            const { iScale , _stacked  } = meta;
            const iAxis = iScale.axis;
            let sorted = start === 0 && count === data.length ? true : meta._sorted;
            let prev = start > 0 && meta._parsed[start - 1];
            let i, cur, parsed;
            if (this._parsing === false) {
                meta._parsed = data;
                meta._sorted = true;
                parsed = data;
            } else {
                if (isArray(data[start])) {
                    parsed = this.parseArrayData(meta, data, start, count);
                } else if (isObject(data[start])) {
                    parsed = this.parseObjectData(meta, data, start, count);
                } else {
                    parsed = this.parsePrimitiveData(meta, data, start, count);
                }
                const isNotInOrderComparedToPrev = ()=>cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
                for(i = 0; i < count; ++i){
                    meta._parsed[i + start] = cur = parsed[i];
                    if (sorted) {
                        if (isNotInOrderComparedToPrev()) {
                            sorted = false;
                        }
                        prev = cur;
                    }
                }
                meta._sorted = sorted;
            }
            if (_stacked) {
                updateStacks(this, parsed);
            }
        }
     parsePrimitiveData(meta, data, start, count) {
            const { iScale , vScale  } = meta;
            const iAxis = iScale.axis;
            const vAxis = vScale.axis;
            const labels = iScale.getLabels();
            const singleScale = iScale === vScale;
            const parsed = new Array(count);
            let i, ilen, index;
            for(i = 0, ilen = count; i < ilen; ++i){
                index = i + start;
                parsed[i] = {
                    [iAxis]: singleScale || iScale.parse(labels[index], index),
                    [vAxis]: vScale.parse(data[index], index)
                };
            }
            return parsed;
        }
     parseArrayData(meta, data, start, count) {
            const { xScale , yScale  } = meta;
            const parsed = new Array(count);
            let i, ilen, index, item;
            for(i = 0, ilen = count; i < ilen; ++i){
                index = i + start;
                item = data[index];
                parsed[i] = {
                    x: xScale.parse(item[0], index),
                    y: yScale.parse(item[1], index)
                };
            }
            return parsed;
        }
     parseObjectData(meta, data, start, count) {
            const { xScale , yScale  } = meta;
            const { xAxisKey ='x' , yAxisKey ='y'  } = this._parsing;
            const parsed = new Array(count);
            let i, ilen, index, item;
            for(i = 0, ilen = count; i < ilen; ++i){
                index = i + start;
                item = data[index];
                parsed[i] = {
                    x: xScale.parse(resolveObjectKey(item, xAxisKey), index),
                    y: yScale.parse(resolveObjectKey(item, yAxisKey), index)
                };
            }
            return parsed;
        }
     getParsed(index) {
            return this._cachedMeta._parsed[index];
        }
     getDataElement(index) {
            return this._cachedMeta.data[index];
        }
     applyStack(scale, parsed, mode) {
            const chart = this.chart;
            const meta = this._cachedMeta;
            const value = parsed[scale.axis];
            const stack = {
                keys: getSortedDatasetIndices(chart, true),
                values: parsed._stacks[scale.axis]._visualValues
            };
            return applyStack(stack, value, meta.index, {
                mode
            });
        }
     updateRangeFromParsed(range, scale, parsed, stack) {
            const parsedValue = parsed[scale.axis];
            let value = parsedValue === null ? NaN : parsedValue;
            const values = stack && parsed._stacks[scale.axis];
            if (stack && values) {
                stack.values = values;
                value = applyStack(stack, parsedValue, this._cachedMeta.index);
            }
            range.min = Math.min(range.min, value);
            range.max = Math.max(range.max, value);
        }
     getMinMax(scale, canStack) {
            const meta = this._cachedMeta;
            const _parsed = meta._parsed;
            const sorted = meta._sorted && scale === meta.iScale;
            const ilen = _parsed.length;
            const otherScale = this._getOtherScale(scale);
            const stack = createStack(canStack, meta, this.chart);
            const range = {
                min: Number.POSITIVE_INFINITY,
                max: Number.NEGATIVE_INFINITY
            };
            const { min: otherMin , max: otherMax  } = getUserBounds(otherScale);
            let i, parsed;
            function _skip() {
                parsed = _parsed[i];
                const otherValue = parsed[otherScale.axis];
                return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
            }
            for(i = 0; i < ilen; ++i){
                if (_skip()) {
                    continue;
                }
                this.updateRangeFromParsed(range, scale, parsed, stack);
                if (sorted) {
                    break;
                }
            }
            if (sorted) {
                for(i = ilen - 1; i >= 0; --i){
                    if (_skip()) {
                        continue;
                    }
                    this.updateRangeFromParsed(range, scale, parsed, stack);
                    break;
                }
            }
            return range;
        }
        getAllParsedValues(scale) {
            const parsed = this._cachedMeta._parsed;
            const values = [];
            let i, ilen, value;
            for(i = 0, ilen = parsed.length; i < ilen; ++i){
                value = parsed[i][scale.axis];
                if (isNumberFinite(value)) {
                    values.push(value);
                }
            }
            return values;
        }
     getMaxOverflow() {
            return false;
        }
     getLabelAndValue(index) {
            const meta = this._cachedMeta;
            const iScale = meta.iScale;
            const vScale = meta.vScale;
            const parsed = this.getParsed(index);
            return {
                label: iScale ? '' + iScale.getLabelForValue(parsed[iScale.axis]) : '',
                value: vScale ? '' + vScale.getLabelForValue(parsed[vScale.axis]) : ''
            };
        }
     _update(mode) {
            const meta = this._cachedMeta;
            this.update(mode || 'default');
            meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
        }
     update(mode) {}
        draw() {
            const ctx = this._ctx;
            const chart = this.chart;
            const meta = this._cachedMeta;
            const elements = meta.data || [];
            const area = chart.chartArea;
            const active = [];
            const start = this._drawStart || 0;
            const count = this._drawCount || elements.length - start;
            const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
            let i;
            if (meta.dataset) {
                meta.dataset.draw(ctx, area, start, count);
            }
            for(i = start; i < start + count; ++i){
                const element = elements[i];
                if (element.hidden) {
                    continue;
                }
                if (element.active && drawActiveElementsOnTop) {
                    active.push(element);
                } else {
                    element.draw(ctx, area);
                }
            }
            for(i = 0; i < active.length; ++i){
                active[i].draw(ctx, area);
            }
        }
     getStyle(index, active) {
            const mode = active ? 'active' : 'default';
            return index === undefined && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
        }
     getContext(index, active, mode) {
            const dataset = this.getDataset();
            let context;
            if (index >= 0 && index < this._cachedMeta.data.length) {
                const element = this._cachedMeta.data[index];
                context = element.$context || (element.$context = createDataContext(this.getContext(), index, element));
                context.parsed = this.getParsed(index);
                context.raw = dataset.data[index];
                context.index = context.dataIndex = index;
            } else {
                context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
                context.dataset = dataset;
                context.index = context.datasetIndex = this.index;
            }
            context.active = !!active;
            context.mode = mode;
            return context;
        }
     resolveDatasetElementOptions(mode) {
            return this._resolveElementOptions(this.datasetElementType.id, mode);
        }
     resolveDataElementOptions(index, mode) {
            return this._resolveElementOptions(this.dataElementType.id, mode, index);
        }
     _resolveElementOptions(elementType, mode = 'default', index) {
            const active = mode === 'active';
            const cache = this._cachedDataOpts;
            const cacheKey = elementType + '-' + mode;
            const cached = cache[cacheKey];
            const sharing = this.enableOptionSharing && defined(index);
            if (cached) {
                return cloneIfNotShared(cached, sharing);
            }
            const config = this.chart.config;
            const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
            const prefixes = active ? [
                `${elementType}Hover`,
                'hover',
                elementType,
                ''
            ] : [
                elementType,
                ''
            ];
            const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
            const names = Object.keys(defaults.elements[elementType]);
            const context = ()=>this.getContext(index, active, mode);
            const values = config.resolveNamedOptions(scopes, names, context, prefixes);
            if (values.$shared) {
                values.$shared = sharing;
                cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
            }
            return values;
        }
     _resolveAnimations(index, transition, active) {
            const chart = this.chart;
            const cache = this._cachedDataOpts;
            const cacheKey = `animation-${transition}`;
            const cached = cache[cacheKey];
            if (cached) {
                return cached;
            }
            let options;
            if (chart.options.animation !== false) {
                const config = this.chart.config;
                const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
                const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
                options = config.createResolver(scopes, this.getContext(index, active, transition));
            }
            const animations = new Animations(chart, options && options.animations);
            if (options && options._cacheable) {
                cache[cacheKey] = Object.freeze(animations);
            }
            return animations;
        }
     getSharedOptions(options) {
            if (!options.$shared) {
                return;
            }
            return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
        }
     includeOptions(mode, sharedOptions) {
            return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
        }
     _getSharedOptions(start, mode) {
            const firstOpts = this.resolveDataElementOptions(start, mode);
            const previouslySharedOptions = this._sharedOptions;
            const sharedOptions = this.getSharedOptions(firstOpts);
            const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
            this.updateSharedOptions(sharedOptions, mode, firstOpts);
            return {
                sharedOptions,
                includeOptions
            };
        }
     updateElement(element, index, properties, mode) {
            if (isDirectUpdateMode(mode)) {
                Object.assign(element, properties);
            } else {
                this._resolveAnimations(index, mode).update(element, properties);
            }
        }
     updateSharedOptions(sharedOptions, mode, newOptions) {
            if (sharedOptions && !isDirectUpdateMode(mode)) {
                this._resolveAnimations(undefined, mode).update(sharedOptions, newOptions);
            }
        }
     _setStyle(element, index, mode, active) {
            element.active = active;
            const options = this.getStyle(index, active);
            this._resolveAnimations(index, mode, active).update(element, {
                options: !active && this.getSharedOptions(options) || options
            });
        }
        removeHoverStyle(element, datasetIndex, index) {
            this._setStyle(element, index, 'active', false);
        }
        setHoverStyle(element, datasetIndex, index) {
            this._setStyle(element, index, 'active', true);
        }
     _removeDatasetHoverStyle() {
            const element = this._cachedMeta.dataset;
            if (element) {
                this._setStyle(element, undefined, 'active', false);
            }
        }
     _setDatasetHoverStyle() {
            const element = this._cachedMeta.dataset;
            if (element) {
                this._setStyle(element, undefined, 'active', true);
            }
        }
     _resyncElements(resetNewElements) {
            const data = this._data;
            const elements = this._cachedMeta.data;
            for (const [method, arg1, arg2] of this._syncList){
                this[method](arg1, arg2);
            }
            this._syncList = [];
            const numMeta = elements.length;
            const numData = data.length;
            const count = Math.min(numData, numMeta);
            if (count) {
                this.parse(0, count);
            }
            if (numData > numMeta) {
                this._insertElements(numMeta, numData - numMeta, resetNewElements);
            } else if (numData < numMeta) {
                this._removeElements(numData, numMeta - numData);
            }
        }
     _insertElements(start, count, resetNewElements = true) {
            const meta = this._cachedMeta;
            const data = meta.data;
            const end = start + count;
            let i;
            const move = (arr)=>{
                arr.length += count;
                for(i = arr.length - 1; i >= end; i--){
                    arr[i] = arr[i - count];
                }
            };
            move(data);
            for(i = start; i < end; ++i){
                data[i] = new this.dataElementType();
            }
            if (this._parsing) {
                move(meta._parsed);
            }
            this.parse(start, count);
            if (resetNewElements) {
                this.updateElements(data, start, count, 'reset');
            }
        }
        updateElements(element, start, count, mode) {}
     _removeElements(start, count) {
            const meta = this._cachedMeta;
            if (this._parsing) {
                const removed = meta._parsed.splice(start, count);
                if (meta._stacked) {
                    clearStacks(meta, removed);
                }
            }
            meta.data.splice(start, count);
        }
     _sync(args) {
            if (this._parsing) {
                this._syncList.push(args);
            } else {
                const [method, arg1, arg2] = args;
                this[method](arg1, arg2);
            }
            this.chart._dataChanges.push([
                this.index,
                ...args
            ]);
        }
        _onDataPush() {
            const count = arguments.length;
            this._sync([
                '_insertElements',
                this.getDataset().data.length - count,
                count
            ]);
        }
        _onDataPop() {
            this._sync([
                '_removeElements',
                this._cachedMeta.data.length - 1,
                1
            ]);
        }
        _onDataShift() {
            this._sync([
                '_removeElements',
                0,
                1
            ]);
        }
        _onDataSplice(start, count) {
            if (count) {
                this._sync([
                    '_removeElements',
                    start,
                    count
                ]);
            }
            const newCount = arguments.length - 2;
            if (newCount) {
                this._sync([
                    '_insertElements',
                    start,
                    newCount
                ]);
            }
        }
        _onDataUnshift() {
            this._sync([
                '_insertElements',
                0,
                arguments.length
            ]);
        }
    }

    function getAllScaleValues(scale, type) {
        if (!scale._cache.$bar) {
            const visibleMetas = scale.getMatchingVisibleMetas(type);
            let values = [];
            for(let i = 0, ilen = visibleMetas.length; i < ilen; i++){
                values = values.concat(visibleMetas[i].controller.getAllParsedValues(scale));
            }
            scale._cache.$bar = _arrayUnique(values.sort((a, b)=>a - b));
        }
        return scale._cache.$bar;
    }
     function computeMinSampleSize(meta) {
        const scale = meta.iScale;
        const values = getAllScaleValues(scale, meta.type);
        let min = scale._length;
        let i, ilen, curr, prev;
        const updateMinAndPrev = ()=>{
            if (curr === 32767 || curr === -32768) {
                return;
            }
            if (defined(prev)) {
                min = Math.min(min, Math.abs(curr - prev) || min);
            }
            prev = curr;
        };
        for(i = 0, ilen = values.length; i < ilen; ++i){
            curr = scale.getPixelForValue(values[i]);
            updateMinAndPrev();
        }
        prev = undefined;
        for(i = 0, ilen = scale.ticks.length; i < ilen; ++i){
            curr = scale.getPixelForTick(i);
            updateMinAndPrev();
        }
        return min;
    }
     function computeFitCategoryTraits(index, ruler, options, stackCount) {
        const thickness = options.barThickness;
        let size, ratio;
        if (isNullOrUndef(thickness)) {
            size = ruler.min * options.categoryPercentage;
            ratio = options.barPercentage;
        } else {
            size = thickness * stackCount;
            ratio = 1;
        }
        return {
            chunk: size / stackCount,
            ratio,
            start: ruler.pixels[index] - size / 2
        };
    }
     function computeFlexCategoryTraits(index, ruler, options, stackCount) {
        const pixels = ruler.pixels;
        const curr = pixels[index];
        let prev = index > 0 ? pixels[index - 1] : null;
        let next = index < pixels.length - 1 ? pixels[index + 1] : null;
        const percent = options.categoryPercentage;
        if (prev === null) {
            prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
        }
        if (next === null) {
            next = curr + curr - prev;
        }
        const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
        const size = Math.abs(next - prev) / 2 * percent;
        return {
            chunk: size / stackCount,
            ratio: options.barPercentage,
            start
        };
    }
    function parseFloatBar(entry, item, vScale, i) {
        const startValue = vScale.parse(entry[0], i);
        const endValue = vScale.parse(entry[1], i);
        const min = Math.min(startValue, endValue);
        const max = Math.max(startValue, endValue);
        let barStart = min;
        let barEnd = max;
        if (Math.abs(min) > Math.abs(max)) {
            barStart = max;
            barEnd = min;
        }
        item[vScale.axis] = barEnd;
        item._custom = {
            barStart,
            barEnd,
            start: startValue,
            end: endValue,
            min,
            max
        };
    }
    function parseValue(entry, item, vScale, i) {
        if (isArray(entry)) {
            parseFloatBar(entry, item, vScale, i);
        } else {
            item[vScale.axis] = vScale.parse(entry, i);
        }
        return item;
    }
    function parseArrayOrPrimitive(meta, data, start, count) {
        const iScale = meta.iScale;
        const vScale = meta.vScale;
        const labels = iScale.getLabels();
        const singleScale = iScale === vScale;
        const parsed = [];
        let i, ilen, item, entry;
        for(i = start, ilen = start + count; i < ilen; ++i){
            entry = data[i];
            item = {};
            item[iScale.axis] = singleScale || iScale.parse(labels[i], i);
            parsed.push(parseValue(entry, item, vScale, i));
        }
        return parsed;
    }
    function isFloatBar(custom) {
        return custom && custom.barStart !== undefined && custom.barEnd !== undefined;
    }
    function barSign(size, vScale, actualBase) {
        if (size !== 0) {
            return sign(size);
        }
        return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
    }
    function borderProps(properties) {
        let reverse, start, end, top, bottom;
        if (properties.horizontal) {
            reverse = properties.base > properties.x;
            start = 'left';
            end = 'right';
        } else {
            reverse = properties.base < properties.y;
            start = 'bottom';
            end = 'top';
        }
        if (reverse) {
            top = 'end';
            bottom = 'start';
        } else {
            top = 'start';
            bottom = 'end';
        }
        return {
            start,
            end,
            reverse,
            top,
            bottom
        };
    }
    function setBorderSkipped(properties, options, stack, index) {
        let edge = options.borderSkipped;
        const res = {};
        if (!edge) {
            properties.borderSkipped = res;
            return;
        }
        if (edge === true) {
            properties.borderSkipped = {
                top: true,
                right: true,
                bottom: true,
                left: true
            };
            return;
        }
        const { start , end , reverse , top , bottom  } = borderProps(properties);
        if (edge === 'middle' && stack) {
            properties.enableBorderRadius = true;
            if ((stack._top || 0) === index) {
                edge = top;
            } else if ((stack._bottom || 0) === index) {
                edge = bottom;
            } else {
                res[parseEdge(bottom, start, end, reverse)] = true;
                edge = top;
            }
        }
        res[parseEdge(edge, start, end, reverse)] = true;
        properties.borderSkipped = res;
    }
    function parseEdge(edge, a, b, reverse) {
        if (reverse) {
            edge = swap(edge, a, b);
            edge = startEnd(edge, b, a);
        } else {
            edge = startEnd(edge, a, b);
        }
        return edge;
    }
    function swap(orig, v1, v2) {
        return orig === v1 ? v2 : orig === v2 ? v1 : orig;
    }
    function startEnd(v, start, end) {
        return v === 'start' ? start : v === 'end' ? end : v;
    }
    function setInflateAmount(properties, { inflateAmount  }, ratio) {
        properties.inflateAmount = inflateAmount === 'auto' ? ratio === 1 ? 0.33 : 0 : inflateAmount;
    }
    class BarController extends DatasetController {
        static id = 'bar';
     static defaults = {
            datasetElementType: false,
            dataElementType: 'bar',
            categoryPercentage: 0.8,
            barPercentage: 0.9,
            grouped: true,
            animations: {
                numbers: {
                    type: 'number',
                    properties: [
                        'x',
                        'y',
                        'base',
                        'width',
                        'height'
                    ]
                }
            }
        };
     static overrides = {
            scales: {
                _index_: {
                    type: 'category',
                    offset: true,
                    grid: {
                        offset: true
                    }
                },
                _value_: {
                    type: 'linear',
                    beginAtZero: true
                }
            }
        };
     parsePrimitiveData(meta, data, start, count) {
            return parseArrayOrPrimitive(meta, data, start, count);
        }
     parseArrayData(meta, data, start, count) {
            return parseArrayOrPrimitive(meta, data, start, count);
        }
     parseObjectData(meta, data, start, count) {
            const { iScale , vScale  } = meta;
            const { xAxisKey ='x' , yAxisKey ='y'  } = this._parsing;
            const iAxisKey = iScale.axis === 'x' ? xAxisKey : yAxisKey;
            const vAxisKey = vScale.axis === 'x' ? xAxisKey : yAxisKey;
            const parsed = [];
            let i, ilen, item, obj;
            for(i = start, ilen = start + count; i < ilen; ++i){
                obj = data[i];
                item = {};
                item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i);
                parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i));
            }
            return parsed;
        }
     updateRangeFromParsed(range, scale, parsed, stack) {
            super.updateRangeFromParsed(range, scale, parsed, stack);
            const custom = parsed._custom;
            if (custom && scale === this._cachedMeta.vScale) {
                range.min = Math.min(range.min, custom.min);
                range.max = Math.max(range.max, custom.max);
            }
        }
     getMaxOverflow() {
            return 0;
        }
     getLabelAndValue(index) {
            const meta = this._cachedMeta;
            const { iScale , vScale  } = meta;
            const parsed = this.getParsed(index);
            const custom = parsed._custom;
            const value = isFloatBar(custom) ? '[' + custom.start + ', ' + custom.end + ']' : '' + vScale.getLabelForValue(parsed[vScale.axis]);
            return {
                label: '' + iScale.getLabelForValue(parsed[iScale.axis]),
                value
            };
        }
        initialize() {
            this.enableOptionSharing = true;
            super.initialize();
            const meta = this._cachedMeta;
            meta.stack = this.getDataset().stack;
        }
        update(mode) {
            const meta = this._cachedMeta;
            this.updateElements(meta.data, 0, meta.data.length, mode);
        }
        updateElements(bars, start, count, mode) {
            const reset = mode === 'reset';
            const { index , _cachedMeta: { vScale  }  } = this;
            const base = vScale.getBasePixel();
            const horizontal = vScale.isHorizontal();
            const ruler = this._getRuler();
            const { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
            for(let i = start; i < start + count; i++){
                const parsed = this.getParsed(i);
                const vpixels = reset || isNullOrUndef(parsed[vScale.axis]) ? {
                    base,
                    head: base
                } : this._calculateBarValuePixels(i);
                const ipixels = this._calculateBarIndexPixels(i, ruler);
                const stack = (parsed._stacks || {})[vScale.axis];
                const properties = {
                    horizontal,
                    base: vpixels.base,
                    enableBorderRadius: !stack || isFloatBar(parsed._custom) || index === stack._top || index === stack._bottom,
                    x: horizontal ? vpixels.head : ipixels.center,
                    y: horizontal ? ipixels.center : vpixels.head,
                    height: horizontal ? ipixels.size : Math.abs(vpixels.size),
                    width: horizontal ? Math.abs(vpixels.size) : ipixels.size
                };
                if (includeOptions) {
                    properties.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? 'active' : mode);
                }
                const options = properties.options || bars[i].options;
                setBorderSkipped(properties, options, stack, index);
                setInflateAmount(properties, options, ruler.ratio);
                this.updateElement(bars[i], i, properties, mode);
            }
        }
     _getStacks(last, dataIndex) {
            const { iScale  } = this._cachedMeta;
            const metasets = iScale.getMatchingVisibleMetas(this._type).filter((meta)=>meta.controller.options.grouped);
            const stacked = iScale.options.stacked;
            const stacks = [];
            const skipNull = (meta)=>{
                const parsed = meta.controller.getParsed(dataIndex);
                const val = parsed && parsed[meta.vScale.axis];
                if (isNullOrUndef(val) || isNaN(val)) {
                    return true;
                }
            };
            for (const meta of metasets){
                if (dataIndex !== undefined && skipNull(meta)) {
                    continue;
                }
                if (stacked === false || stacks.indexOf(meta.stack) === -1 || stacked === undefined && meta.stack === undefined) {
                    stacks.push(meta.stack);
                }
                if (meta.index === last) {
                    break;
                }
            }
            if (!stacks.length) {
                stacks.push(undefined);
            }
            return stacks;
        }
     _getStackCount(index) {
            return this._getStacks(undefined, index).length;
        }
     _getStackIndex(datasetIndex, name, dataIndex) {
            const stacks = this._getStacks(datasetIndex, dataIndex);
            const index = name !== undefined ? stacks.indexOf(name) : -1;
            return index === -1 ? stacks.length - 1 : index;
        }
     _getRuler() {
            const opts = this.options;
            const meta = this._cachedMeta;
            const iScale = meta.iScale;
            const pixels = [];
            let i, ilen;
            for(i = 0, ilen = meta.data.length; i < ilen; ++i){
                pixels.push(iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i));
            }
            const barThickness = opts.barThickness;
            const min = barThickness || computeMinSampleSize(meta);
            return {
                min,
                pixels,
                start: iScale._startPixel,
                end: iScale._endPixel,
                stackCount: this._getStackCount(),
                scale: iScale,
                grouped: opts.grouped,
                ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
            };
        }
     _calculateBarValuePixels(index) {
            const { _cachedMeta: { vScale , _stacked , index: datasetIndex  } , options: { base: baseValue , minBarLength  }  } = this;
            const actualBase = baseValue || 0;
            const parsed = this.getParsed(index);
            const custom = parsed._custom;
            const floating = isFloatBar(custom);
            let value = parsed[vScale.axis];
            let start = 0;
            let length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
            let head, size;
            if (length !== value) {
                start = length - value;
                length = value;
            }
            if (floating) {
                value = custom.barStart;
                length = custom.barEnd - custom.barStart;
                if (value !== 0 && sign(value) !== sign(custom.barEnd)) {
                    start = 0;
                }
                start += value;
            }
            const startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
            let base = vScale.getPixelForValue(startValue);
            if (this.chart.getDataVisibility(index)) {
                head = vScale.getPixelForValue(start + length);
            } else {
                head = base;
            }
            size = head - base;
            if (Math.abs(size) < minBarLength) {
                size = barSign(size, vScale, actualBase) * minBarLength;
                if (value === actualBase) {
                    base -= size / 2;
                }
                const startPixel = vScale.getPixelForDecimal(0);
                const endPixel = vScale.getPixelForDecimal(1);
                const min = Math.min(startPixel, endPixel);
                const max = Math.max(startPixel, endPixel);
                base = Math.max(Math.min(base, max), min);
                head = base + size;
                if (_stacked && !floating) {
                    parsed._stacks[vScale.axis]._visualValues[datasetIndex] = vScale.getValueForPixel(head) - vScale.getValueForPixel(base);
                }
            }
            if (base === vScale.getPixelForValue(actualBase)) {
                const halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
                base += halfGrid;
                size -= halfGrid;
            }
            return {
                size,
                base,
                head,
                center: head + size / 2
            };
        }
     _calculateBarIndexPixels(index, ruler) {
            const scale = ruler.scale;
            const options = this.options;
            const skipNull = options.skipNull;
            const maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity);
            let center, size;
            if (ruler.grouped) {
                const stackCount = skipNull ? this._getStackCount(index) : ruler.stackCount;
                const range = options.barThickness === 'flex' ? computeFlexCategoryTraits(index, ruler, options, stackCount) : computeFitCategoryTraits(index, ruler, options, stackCount);
                const stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index : undefined);
                center = range.start + range.chunk * stackIndex + range.chunk / 2;
                size = Math.min(maxBarThickness, range.chunk * range.ratio);
            } else {
                center = scale.getPixelForValue(this.getParsed(index)[scale.axis], index);
                size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
            }
            return {
                base: center - size / 2,
                head: center + size / 2,
                center,
                size
            };
        }
        draw() {
            const meta = this._cachedMeta;
            const vScale = meta.vScale;
            const rects = meta.data;
            const ilen = rects.length;
            let i = 0;
            for(; i < ilen; ++i){
                if (this.getParsed(i)[vScale.axis] !== null) {
                    rects[i].draw(this._ctx);
                }
            }
        }
    }

    class BubbleController extends DatasetController {
        static id = 'bubble';
     static defaults = {
            datasetElementType: false,
            dataElementType: 'point',
            animations: {
                numbers: {
                    type: 'number',
                    properties: [
                        'x',
                        'y',
                        'borderWidth',
                        'radius'
                    ]
                }
            }
        };
     static overrides = {
            scales: {
                x: {
                    type: 'linear'
                },
                y: {
                    type: 'linear'
                }
            }
        };
        initialize() {
            this.enableOptionSharing = true;
            super.initialize();
        }
     parsePrimitiveData(meta, data, start, count) {
            const parsed = super.parsePrimitiveData(meta, data, start, count);
            for(let i = 0; i < parsed.length; i++){
                parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
            }
            return parsed;
        }
     parseArrayData(meta, data, start, count) {
            const parsed = super.parseArrayData(meta, data, start, count);
            for(let i = 0; i < parsed.length; i++){
                const item = data[start + i];
                parsed[i]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i + start).radius);
            }
            return parsed;
        }
     parseObjectData(meta, data, start, count) {
            const parsed = super.parseObjectData(meta, data, start, count);
            for(let i = 0; i < parsed.length; i++){
                const item = data[start + i];
                parsed[i]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
            }
            return parsed;
        }
     getMaxOverflow() {
            const data = this._cachedMeta.data;
            let max = 0;
            for(let i = data.length - 1; i >= 0; --i){
                max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
            }
            return max > 0 && max;
        }
     getLabelAndValue(index) {
            const meta = this._cachedMeta;
            const labels = this.chart.data.labels || [];
            const { xScale , yScale  } = meta;
            const parsed = this.getParsed(index);
            const x = xScale.getLabelForValue(parsed.x);
            const y = yScale.getLabelForValue(parsed.y);
            const r = parsed._custom;
            return {
                label: labels[index] || '',
                value: '(' + x + ', ' + y + (r ? ', ' + r : '') + ')'
            };
        }
        update(mode) {
            const points = this._cachedMeta.data;
            this.updateElements(points, 0, points.length, mode);
        }
        updateElements(points, start, count, mode) {
            const reset = mode === 'reset';
            const { iScale , vScale  } = this._cachedMeta;
            const { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
            const iAxis = iScale.axis;
            const vAxis = vScale.axis;
            for(let i = start; i < start + count; i++){
                const point = points[i];
                const parsed = !reset && this.getParsed(i);
                const properties = {};
                const iPixel = properties[iAxis] = reset ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
                const vPixel = properties[vAxis] = reset ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
                properties.skip = isNaN(iPixel) || isNaN(vPixel);
                if (includeOptions) {
                    properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
                    if (reset) {
                        properties.options.radius = 0;
                    }
                }
                this.updateElement(point, i, properties, mode);
            }
        }
     resolveDataElementOptions(index, mode) {
            const parsed = this.getParsed(index);
            let values = super.resolveDataElementOptions(index, mode);
            if (values.$shared) {
                values = Object.assign({}, values, {
                    $shared: false
                });
            }
            const radius = values.radius;
            if (mode !== 'active') {
                values.radius = 0;
            }
            values.radius += valueOrDefault(parsed && parsed._custom, radius);
            return values;
        }
    }

    function getRatioAndOffset(rotation, circumference, cutout) {
        let ratioX = 1;
        let ratioY = 1;
        let offsetX = 0;
        let offsetY = 0;
        if (circumference < TAU) {
            const startAngle = rotation;
            const endAngle = startAngle + circumference;
            const startX = Math.cos(startAngle);
            const startY = Math.sin(startAngle);
            const endX = Math.cos(endAngle);
            const endY = Math.sin(endAngle);
            const calcMax = (angle, a, b)=>_angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a, a * cutout, b, b * cutout);
            const calcMin = (angle, a, b)=>_angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
            const maxX = calcMax(0, startX, endX);
            const maxY = calcMax(HALF_PI, startY, endY);
            const minX = calcMin(PI, startX, endX);
            const minY = calcMin(PI + HALF_PI, startY, endY);
            ratioX = (maxX - minX) / 2;
            ratioY = (maxY - minY) / 2;
            offsetX = -(maxX + minX) / 2;
            offsetY = -(maxY + minY) / 2;
        }
        return {
            ratioX,
            ratioY,
            offsetX,
            offsetY
        };
    }
    class DoughnutController extends DatasetController {
        static id = 'doughnut';
     static defaults = {
            datasetElementType: false,
            dataElementType: 'arc',
            animation: {
                animateRotate: true,
                animateScale: false
            },
            animations: {
                numbers: {
                    type: 'number',
                    properties: [
                        'circumference',
                        'endAngle',
                        'innerRadius',
                        'outerRadius',
                        'startAngle',
                        'x',
                        'y',
                        'offset',
                        'borderWidth',
                        'spacing'
                    ]
                }
            },
            cutout: '50%',
            rotation: 0,
            circumference: 360,
            radius: '100%',
            spacing: 0,
            indexAxis: 'r'
        };
        static descriptors = {
            _scriptable: (name)=>name !== 'spacing',
            _indexable: (name)=>name !== 'spacing' && !name.startsWith('borderDash') && !name.startsWith('hoverBorderDash')
        };
     static overrides = {
            aspectRatio: 1,
            plugins: {
                legend: {
                    labels: {
                        generateLabels (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                const { labels: { pointStyle , color  }  } = chart.legend.options;
                                return data.labels.map((label, i)=>{
                                    const meta = chart.getDatasetMeta(0);
                                    const style = meta.controller.getStyle(i);
                                    return {
                                        text: label,
                                        fillStyle: style.backgroundColor,
                                        strokeStyle: style.borderColor,
                                        fontColor: color,
                                        lineWidth: style.borderWidth,
                                        pointStyle: pointStyle,
                                        hidden: !chart.getDataVisibility(i),
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    },
                    onClick (e, legendItem, legend) {
                        legend.chart.toggleDataVisibility(legendItem.index);
                        legend.chart.update();
                    }
                }
            }
        };
        constructor(chart, datasetIndex){
            super(chart, datasetIndex);
            this.enableOptionSharing = true;
            this.innerRadius = undefined;
            this.outerRadius = undefined;
            this.offsetX = undefined;
            this.offsetY = undefined;
        }
        linkScales() {}
     parse(start, count) {
            const data = this.getDataset().data;
            const meta = this._cachedMeta;
            if (this._parsing === false) {
                meta._parsed = data;
            } else {
                let getter = (i)=>+data[i];
                if (isObject(data[start])) {
                    const { key ='value'  } = this._parsing;
                    getter = (i)=>+resolveObjectKey(data[i], key);
                }
                let i, ilen;
                for(i = start, ilen = start + count; i < ilen; ++i){
                    meta._parsed[i] = getter(i);
                }
            }
        }
     _getRotation() {
            return toRadians(this.options.rotation - 90);
        }
     _getCircumference() {
            return toRadians(this.options.circumference);
        }
     _getRotationExtents() {
            let min = TAU;
            let max = -TAU;
            for(let i = 0; i < this.chart.data.datasets.length; ++i){
                if (this.chart.isDatasetVisible(i) && this.chart.getDatasetMeta(i).type === this._type) {
                    const controller = this.chart.getDatasetMeta(i).controller;
                    const rotation = controller._getRotation();
                    const circumference = controller._getCircumference();
                    min = Math.min(min, rotation);
                    max = Math.max(max, rotation + circumference);
                }
            }
            return {
                rotation: min,
                circumference: max - min
            };
        }
     update(mode) {
            const chart = this.chart;
            const { chartArea  } = chart;
            const meta = this._cachedMeta;
            const arcs = meta.data;
            const spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
            const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
            const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
            const chartWeight = this._getRingWeight(this.index);
            const { circumference , rotation  } = this._getRotationExtents();
            const { ratioX , ratioY , offsetX , offsetY  } = getRatioAndOffset(rotation, circumference, cutout);
            const maxWidth = (chartArea.width - spacing) / ratioX;
            const maxHeight = (chartArea.height - spacing) / ratioY;
            const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
            const outerRadius = toDimension(this.options.radius, maxRadius);
            const innerRadius = Math.max(outerRadius * cutout, 0);
            const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
            this.offsetX = offsetX * outerRadius;
            this.offsetY = offsetY * outerRadius;
            meta.total = this.calculateTotal();
            this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
            this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
            this.updateElements(arcs, 0, arcs.length, mode);
        }
     _circumference(i, reset) {
            const opts = this.options;
            const meta = this._cachedMeta;
            const circumference = this._getCircumference();
            if (reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
                return 0;
            }
            return this.calculateCircumference(meta._parsed[i] * circumference / TAU);
        }
        updateElements(arcs, start, count, mode) {
            const reset = mode === 'reset';
            const chart = this.chart;
            const chartArea = chart.chartArea;
            const opts = chart.options;
            const animationOpts = opts.animation;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            const animateScale = reset && animationOpts.animateScale;
            const innerRadius = animateScale ? 0 : this.innerRadius;
            const outerRadius = animateScale ? 0 : this.outerRadius;
            const { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
            let startAngle = this._getRotation();
            let i;
            for(i = 0; i < start; ++i){
                startAngle += this._circumference(i, reset);
            }
            for(i = start; i < start + count; ++i){
                const circumference = this._circumference(i, reset);
                const arc = arcs[i];
                const properties = {
                    x: centerX + this.offsetX,
                    y: centerY + this.offsetY,
                    startAngle,
                    endAngle: startAngle + circumference,
                    circumference,
                    outerRadius,
                    innerRadius
                };
                if (includeOptions) {
                    properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? 'active' : mode);
                }
                startAngle += circumference;
                this.updateElement(arc, i, properties, mode);
            }
        }
        calculateTotal() {
            const meta = this._cachedMeta;
            const metaData = meta.data;
            let total = 0;
            let i;
            for(i = 0; i < metaData.length; i++){
                const value = meta._parsed[i];
                if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
                    total += Math.abs(value);
                }
            }
            return total;
        }
        calculateCircumference(value) {
            const total = this._cachedMeta.total;
            if (total > 0 && !isNaN(value)) {
                return TAU * (Math.abs(value) / total);
            }
            return 0;
        }
        getLabelAndValue(index) {
            const meta = this._cachedMeta;
            const chart = this.chart;
            const labels = chart.data.labels || [];
            const value = formatNumber(meta._parsed[index], chart.options.locale);
            return {
                label: labels[index] || '',
                value
            };
        }
        getMaxBorderWidth(arcs) {
            let max = 0;
            const chart = this.chart;
            let i, ilen, meta, controller, options;
            if (!arcs) {
                for(i = 0, ilen = chart.data.datasets.length; i < ilen; ++i){
                    if (chart.isDatasetVisible(i)) {
                        meta = chart.getDatasetMeta(i);
                        arcs = meta.data;
                        controller = meta.controller;
                        break;
                    }
                }
            }
            if (!arcs) {
                return 0;
            }
            for(i = 0, ilen = arcs.length; i < ilen; ++i){
                options = controller.resolveDataElementOptions(i);
                if (options.borderAlign !== 'inner') {
                    max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
                }
            }
            return max;
        }
        getMaxOffset(arcs) {
            let max = 0;
            for(let i = 0, ilen = arcs.length; i < ilen; ++i){
                const options = this.resolveDataElementOptions(i);
                max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
            }
            return max;
        }
     _getRingWeightOffset(datasetIndex) {
            let ringWeightOffset = 0;
            for(let i = 0; i < datasetIndex; ++i){
                if (this.chart.isDatasetVisible(i)) {
                    ringWeightOffset += this._getRingWeight(i);
                }
            }
            return ringWeightOffset;
        }
     _getRingWeight(datasetIndex) {
            return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
        }
     _getVisibleDatasetWeightTotal() {
            return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
        }
    }

    class LineController extends DatasetController {
        static id = 'line';
     static defaults = {
            datasetElementType: 'line',
            dataElementType: 'point',
            showLine: true,
            spanGaps: false
        };
     static overrides = {
            scales: {
                _index_: {
                    type: 'category'
                },
                _value_: {
                    type: 'linear'
                }
            }
        };
        initialize() {
            this.enableOptionSharing = true;
            this.supportsDecimation = true;
            super.initialize();
        }
        update(mode) {
            const meta = this._cachedMeta;
            const { dataset: line , data: points = [] , _dataset  } = meta;
            const animationsDisabled = this.chart._animationsDisabled;
            let { start , count  } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
            this._drawStart = start;
            this._drawCount = count;
            if (_scaleRangesChanged(meta)) {
                start = 0;
                count = points.length;
            }
            line._chart = this.chart;
            line._datasetIndex = this.index;
            line._decimated = !!_dataset._decimated;
            line.points = points;
            const options = this.resolveDatasetElementOptions(mode);
            if (!this.options.showLine) {
                options.borderWidth = 0;
            }
            options.segment = this.options.segment;
            this.updateElement(line, undefined, {
                animated: !animationsDisabled,
                options
            }, mode);
            this.updateElements(points, start, count, mode);
        }
        updateElements(points, start, count, mode) {
            const reset = mode === 'reset';
            const { iScale , vScale , _stacked , _dataset  } = this._cachedMeta;
            const { sharedOptions , includeOptions  } = this._getSharedOptions(start, mode);
            const iAxis = iScale.axis;
            const vAxis = vScale.axis;
            const { spanGaps , segment  } = this.options;
            const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
            const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
            const end = start + count;
            const pointsCount = points.length;
            let prevParsed = start > 0 && this.getParsed(start - 1);
            for(let i = 0; i < pointsCount; ++i){
                const point = points[i];
                const properties = directUpdate ? point : {};
                if (i < start || i >= end) {
                    properties.skip = true;
                    continue;
                }
                const parsed = this.getParsed(i);
                const nullData = isNullOrUndef(parsed[vAxis]);
                const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
                const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
                properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
                properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
                if (segment) {
                    properties.parsed = parsed;
                    properties.raw = _dataset.data[i];
                }
                if (includeOptions) {
                    properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
                }
                if (!directUpdate) {
                    this.updateElement(point, i, properties, mode);
                }
                prevParsed = parsed;
            }
        }
     getMaxOverflow() {
            const meta = this._cachedMeta;
            const dataset = meta.dataset;
            const border = dataset.options && dataset.options.borderWidth || 0;
            const data = meta.data || [];
            if (!data.length) {
                return border;
            }
            const firstPoint = data[0].size(this.resolveDataElementOptions(0));
            const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
            return Math.max(border, firstPoint, lastPoint) / 2;
        }
        draw() {
            const meta = this._cachedMeta;
            meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
            super.draw();
        }
    }

    class PolarAreaController extends DatasetController {
        static id = 'polarArea';
     static defaults = {
            dataElementType: 'arc',
            animation: {
                animateRotate: true,
                animateScale: true
            },
            animations: {
                numbers: {
                    type: 'number',
                    properties: [
                        'x',
                        'y',
                        'startAngle',
                        'endAngle',
                        'innerRadius',
                        'outerRadius'
                    ]
                }
            },
            indexAxis: 'r',
            startAngle: 0
        };
     static overrides = {
            aspectRatio: 1,
            plugins: {
                legend: {
                    labels: {
                        generateLabels (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                const { labels: { pointStyle , color  }  } = chart.legend.options;
                                return data.labels.map((label, i)=>{
                                    const meta = chart.getDatasetMeta(0);
                                    const style = meta.controller.getStyle(i);
                                    return {
                                        text: label,
                                        fillStyle: style.backgroundColor,
                                        strokeStyle: style.borderColor,
                                        fontColor: color,
                                        lineWidth: style.borderWidth,
                                        pointStyle: pointStyle,
                                        hidden: !chart.getDataVisibility(i),
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    },
                    onClick (e, legendItem, legend) {
                        legend.chart.toggleDataVisibility(legendItem.index);
                        legend.chart.update();
                    }
                }
            },
            scales: {
                r: {
                    type: 'radialLinear',
                    angleLines: {
                        display: false
                    },
                    beginAtZero: true,
                    grid: {
                        circular: true
                    },
                    pointLabels: {
                        display: false
                    },
                    startAngle: 0
                }
            }
        };
        constructor(chart, datasetIndex){
            super(chart, datasetIndex);
            this.innerRadius = undefined;
            this.outerRadius = undefined;
        }
        getLabelAndValue(index) {
            const meta = this._cachedMeta;
            const chart = this.chart;
            const labels = chart.data.labels || [];
            const value = formatNumber(meta._parsed[index].r, chart.options.locale);
            return {
                label: labels[index] || '',
                value
            };
        }
        parseObjectData(meta, data, start, count) {
            return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
        }
        update(mode) {
            const arcs = this._cachedMeta.data;
            this._updateRadius();
            this.updateElements(arcs, 0, arcs.length, mode);
        }
     getMinMax() {
            const meta = this._cachedMeta;
            const range = {
                min: Number.POSITIVE_INFINITY,
                max: Number.NEGATIVE_INFINITY
            };
            meta.data.forEach((element, index)=>{
                const parsed = this.getParsed(index).r;
                if (!isNaN(parsed) && this.chart.getDataVisibility(index)) {
                    if (parsed < range.min) {
                        range.min = parsed;
                    }
                    if (parsed > range.max) {
                        range.max = parsed;
                    }
                }
            });
            return range;
        }
     _updateRadius() {
            const chart = this.chart;
            const chartArea = chart.chartArea;
            const opts = chart.options;
            const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            const outerRadius = Math.max(minSize / 2, 0);
            const innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
            const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
            this.outerRadius = outerRadius - radiusLength * this.index;
            this.innerRadius = this.outerRadius - radiusLength;
        }
        updateElements(arcs, start, count, mode) {
            const reset = mode === 'reset';
            const chart = this.chart;
            const opts = chart.options;
            const animationOpts = opts.animation;
            const scale = this._cachedMeta.rScale;
            const centerX = scale.xCenter;
            const centerY = scale.yCenter;
            const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
            let angle = datasetStartAngle;
            let i;
            const defaultAngle = 360 / this.countVisibleElements();
            for(i = 0; i < start; ++i){
                angle += this._computeAngle(i, mode, defaultAngle);
            }
            for(i = start; i < start + count; i++){
                const arc = arcs[i];
                let startAngle = angle;
                let endAngle = angle + this._computeAngle(i, mode, defaultAngle);
                let outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(this.getParsed(i).r) : 0;
                angle = endAngle;
                if (reset) {
                    if (animationOpts.animateScale) {
                        outerRadius = 0;
                    }
                    if (animationOpts.animateRotate) {
                        startAngle = endAngle = datasetStartAngle;
                    }
                }
                const properties = {
                    x: centerX,
                    y: centerY,
                    innerRadius: 0,
                    outerRadius,
                    startAngle,
                    endAngle,
                    options: this.resolveDataElementOptions(i, arc.active ? 'active' : mode)
                };
                this.updateElement(arc, i, properties, mode);
            }
        }
        countVisibleElements() {
            const meta = this._cachedMeta;
            let count = 0;
            meta.data.forEach((element, index)=>{
                if (!isNaN(this.getParsed(index).r) && this.chart.getDataVisibility(index)) {
                    count++;
                }
            });
            return count;
        }
     _computeAngle(index, mode, defaultAngle) {
            return this.chart.getDataVisibility(index) ? toRadians(this.resolveDataElementOptions(index, mode).angle || defaultAngle) : 0;
        }
    }

    class PieController extends DoughnutController {
        static id = 'pie';
     static defaults = {
            cutout: 0,
            rotation: 0,
            circumference: 360,
            radius: '100%'
        };
    }

    class RadarController extends DatasetController {
        static id = 'radar';
     static defaults = {
            datasetElementType: 'line',
            dataElementType: 'point',
            indexAxis: 'r',
            showLine: true,
            elements: {
                line: {
                    fill: 'start'
                }
            }
        };
     static overrides = {
            aspectRatio: 1,
            scales: {
                r: {
                    type: 'radialLinear'
                }
            }
        };
     getLabelAndValue(index) {
            const vScale = this._cachedMeta.vScale;
            const parsed = this.getParsed(index);
            return {
                label: vScale.getLabels()[index],
                value: '' + vScale.getLabelForValue(parsed[vScale.axis])
            };
        }
        parseObjectData(meta, data, start, count) {
            return _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
        }
        update(mode) {
            const meta = this._cachedMeta;
            const line = meta.dataset;
            const points = meta.data || [];
            const labels = meta.iScale.getLabels();
            line.points = points;
            if (mode !== 'resize') {
                const options = this.resolveDatasetElementOptions(mode);
                if (!this.options.showLine) {
                    options.borderWidth = 0;
                }
                const properties = {
                    _loop: true,
                    _fullLoop: labels.length === points.length,
                    options
                };
                this.updateElement(line, undefined, properties, mode);
            }
            this.updateElements(points, 0, points.length, mode);
        }
        updateElements(points, start, count, mode) {
            const scale = this._cachedMeta.rScale;
            const reset = mode === 'reset';
            for(let i = start; i < start + count; i++){
                const point = points[i];
                const options = this.resolveDataElementOptions(i, point.active ? 'active' : mode);
                const pointPosition = scale.getPointPositionForValue(i, this.getParsed(i).r);
                const x = reset ? scale.xCenter : pointPosition.x;
                const y = reset ? scale.yCenter : pointPosition.y;
                const properties = {
                    x,
                    y,
                    angle: pointPosition.angle,
                    skip: isNaN(x) || isNaN(y),
                    options
                };
                this.updateElement(point, i, properties, mode);
            }
        }
    }

    class ScatterController extends DatasetController {
        static id = 'scatter';
     static defaults = {
            datasetElementType: false,
            dataElementType: 'point',
            showLine: false,
            fill: false
        };
     static overrides = {
            interaction: {
                mode: 'point'
            },
            scales: {
                x: {
                    type: 'linear'
                },
                y: {
                    type: 'linear'
                }
            }
        };
     getLabelAndValue(index) {
            const meta = this._cachedMeta;
            const labels = this.chart.data.labels || [];
            const { xScale , yScale  } = meta;
            const parsed = this.getParsed(index);
            const x = xScale.getLabelForValue(parsed.x);
            const y = yScale.getLabelForValue(parsed.y);
            return {
                label: labels[index] || '',
                value: '(' + x + ', ' + y + ')'
            };
        }
        update(mode) {
            const meta = this._cachedMeta;
            const { data: points = []  } = meta;
            const animationsDisabled = this.chart._animationsDisabled;
            let { start , count  } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
            this._drawStart = start;
            this._drawCount = count;
            if (_scaleRangesChanged(meta)) {
                start = 0;
                count = points.length;
            }
            if (this.options.showLine) {
                if (!this.datasetElementType) {
                    this.addElements();
                }
                const { dataset: line , _dataset  } = meta;
                line._chart = this.chart;
                line._datasetIndex = this.index;
                line._decimated = !!_dataset._decimated;
                line.points = points;
                const options = this.resolveDatasetElementOptions(mode);
                options.segment = this.options.segment;
                this.updateElement(line, undefined, {
                    animated: !animationsDisabled,
                    options
                }, mode);
            } else if (this.datasetElementType) {
                delete meta.dataset;
                this.datasetElementType = false;
            }
            this.updateElements(points, start, count, mode);
        }
        addElements() {
            const { showLine  } = this.options;
            if (!this.datasetElementType && showLine) {
                this.datasetElementType = this.chart.registry.getElement('line');
            }
            super.addElements();
        }
        updateElements(points, start, count, mode) {
            const reset = mode === 'reset';
            const { iScale , vScale , _stacked , _dataset  } = this._cachedMeta;
            const firstOpts = this.resolveDataElementOptions(start, mode);
            const sharedOptions = this.getSharedOptions(firstOpts);
            const includeOptions = this.includeOptions(mode, sharedOptions);
            const iAxis = iScale.axis;
            const vAxis = vScale.axis;
            const { spanGaps , segment  } = this.options;
            const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
            const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
            let prevParsed = start > 0 && this.getParsed(start - 1);
            for(let i = start; i < start + count; ++i){
                const point = points[i];
                const parsed = this.getParsed(i);
                const properties = directUpdate ? point : {};
                const nullData = isNullOrUndef(parsed[vAxis]);
                const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
                const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
                properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
                properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
                if (segment) {
                    properties.parsed = parsed;
                    properties.raw = _dataset.data[i];
                }
                if (includeOptions) {
                    properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
                }
                if (!directUpdate) {
                    this.updateElement(point, i, properties, mode);
                }
                prevParsed = parsed;
            }
            this.updateSharedOptions(sharedOptions, mode, firstOpts);
        }
     getMaxOverflow() {
            const meta = this._cachedMeta;
            const data = meta.data || [];
            if (!this.options.showLine) {
                let max = 0;
                for(let i = data.length - 1; i >= 0; --i){
                    max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
                }
                return max > 0 && max;
            }
            const dataset = meta.dataset;
            const border = dataset.options && dataset.options.borderWidth || 0;
            if (!data.length) {
                return border;
            }
            const firstPoint = data[0].size(this.resolveDataElementOptions(0));
            const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
            return Math.max(border, firstPoint, lastPoint) / 2;
        }
    }

    var controllers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BarController: BarController,
    BubbleController: BubbleController,
    DoughnutController: DoughnutController,
    LineController: LineController,
    PieController: PieController,
    PolarAreaController: PolarAreaController,
    RadarController: RadarController,
    ScatterController: ScatterController
    });

    /**
     * @namespace Chart._adapters
     * @since 2.8.0
     * @private
     */ function abstract() {
        throw new Error('This method is not implemented: Check that a complete date adapter is provided.');
    }
    /**
     * Date adapter (current used by the time scale)
     * @namespace Chart._adapters._date
     * @memberof Chart._adapters
     * @private
     */ class DateAdapterBase {
        /**
       * Override default date adapter methods.
       * Accepts type parameter to define options type.
       * @example
       * Chart._adapters._date.override<{myAdapterOption: string}>({
       *   init() {
       *     console.log(this.options.myAdapterOption);
       *   }
       * })
       */ static override(members) {
            Object.assign(DateAdapterBase.prototype, members);
        }
        options;
        constructor(options){
            this.options = options || {};
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        init() {}
        formats() {
            return abstract();
        }
        parse() {
            return abstract();
        }
        format() {
            return abstract();
        }
        add() {
            return abstract();
        }
        diff() {
            return abstract();
        }
        startOf() {
            return abstract();
        }
        endOf() {
            return abstract();
        }
    }
    var adapters = {
        _date: DateAdapterBase
    };

    function binarySearch(metaset, axis, value, intersect) {
        const { controller , data , _sorted  } = metaset;
        const iScale = controller._cachedMeta.iScale;
        if (iScale && axis === iScale.axis && axis !== 'r' && _sorted && data.length) {
            const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
            if (!intersect) {
                return lookupMethod(data, axis, value);
            } else if (controller._sharedOptions) {
                const el = data[0];
                const range = typeof el.getRange === 'function' && el.getRange(axis);
                if (range) {
                    const start = lookupMethod(data, axis, value - range);
                    const end = lookupMethod(data, axis, value + range);
                    return {
                        lo: start.lo,
                        hi: end.hi
                    };
                }
            }
        }
        return {
            lo: 0,
            hi: data.length - 1
        };
    }
     function evaluateInteractionItems(chart, axis, position, handler, intersect) {
        const metasets = chart.getSortedVisibleDatasetMetas();
        const value = position[axis];
        for(let i = 0, ilen = metasets.length; i < ilen; ++i){
            const { index , data  } = metasets[i];
            const { lo , hi  } = binarySearch(metasets[i], axis, value, intersect);
            for(let j = lo; j <= hi; ++j){
                const element = data[j];
                if (!element.skip) {
                    handler(element, index, j);
                }
            }
        }
    }
     function getDistanceMetricForAxis(axis) {
        const useX = axis.indexOf('x') !== -1;
        const useY = axis.indexOf('y') !== -1;
        return function(pt1, pt2) {
            const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
            const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
            return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        };
    }
     function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
        const items = [];
        if (!includeInvisible && !chart.isPointInArea(position)) {
            return items;
        }
        const evaluationFunc = function(element, datasetIndex, index) {
            if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
                return;
            }
            if (element.inRange(position.x, position.y, useFinalPosition)) {
                items.push({
                    element,
                    datasetIndex,
                    index
                });
            }
        };
        evaluateInteractionItems(chart, axis, position, evaluationFunc, true);
        return items;
    }
     function getNearestRadialItems(chart, position, axis, useFinalPosition) {
        let items = [];
        function evaluationFunc(element, datasetIndex, index) {
            const { startAngle , endAngle  } = element.getProps([
                'startAngle',
                'endAngle'
            ], useFinalPosition);
            const { angle  } = getAngleFromPoint(element, {
                x: position.x,
                y: position.y
            });
            if (_angleBetween(angle, startAngle, endAngle)) {
                items.push({
                    element,
                    datasetIndex,
                    index
                });
            }
        }
        evaluateInteractionItems(chart, axis, position, evaluationFunc);
        return items;
    }
     function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
        let items = [];
        const distanceMetric = getDistanceMetricForAxis(axis);
        let minDistance = Number.POSITIVE_INFINITY;
        function evaluationFunc(element, datasetIndex, index) {
            const inRange = element.inRange(position.x, position.y, useFinalPosition);
            if (intersect && !inRange) {
                return;
            }
            const center = element.getCenterPoint(useFinalPosition);
            const pointInArea = !!includeInvisible || chart.isPointInArea(center);
            if (!pointInArea && !inRange) {
                return;
            }
            const distance = distanceMetric(position, center);
            if (distance < minDistance) {
                items = [
                    {
                        element,
                        datasetIndex,
                        index
                    }
                ];
                minDistance = distance;
            } else if (distance === minDistance) {
                items.push({
                    element,
                    datasetIndex,
                    index
                });
            }
        }
        evaluateInteractionItems(chart, axis, position, evaluationFunc);
        return items;
    }
     function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
        if (!includeInvisible && !chart.isPointInArea(position)) {
            return [];
        }
        return axis === 'r' && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
    }
     function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
        const items = [];
        const rangeMethod = axis === 'x' ? 'inXRange' : 'inYRange';
        let intersectsItem = false;
        evaluateInteractionItems(chart, axis, position, (element, datasetIndex, index)=>{
            if (element[rangeMethod](position[axis], useFinalPosition)) {
                items.push({
                    element,
                    datasetIndex,
                    index
                });
                intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
            }
        });
        if (intersect && !intersectsItem) {
            return [];
        }
        return items;
    }
     var Interaction = {
        evaluateInteractionItems,
        modes: {
     index (chart, e, options, useFinalPosition) {
                const position = getRelativePosition(e, chart);
                const axis = options.axis || 'x';
                const includeInvisible = options.includeInvisible || false;
                const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
                const elements = [];
                if (!items.length) {
                    return [];
                }
                chart.getSortedVisibleDatasetMetas().forEach((meta)=>{
                    const index = items[0].index;
                    const element = meta.data[index];
                    if (element && !element.skip) {
                        elements.push({
                            element,
                            datasetIndex: meta.index,
                            index
                        });
                    }
                });
                return elements;
            },
     dataset (chart, e, options, useFinalPosition) {
                const position = getRelativePosition(e, chart);
                const axis = options.axis || 'xy';
                const includeInvisible = options.includeInvisible || false;
                let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
                if (items.length > 0) {
                    const datasetIndex = items[0].datasetIndex;
                    const data = chart.getDatasetMeta(datasetIndex).data;
                    items = [];
                    for(let i = 0; i < data.length; ++i){
                        items.push({
                            element: data[i],
                            datasetIndex,
                            index: i
                        });
                    }
                }
                return items;
            },
     point (chart, e, options, useFinalPosition) {
                const position = getRelativePosition(e, chart);
                const axis = options.axis || 'xy';
                const includeInvisible = options.includeInvisible || false;
                return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
            },
     nearest (chart, e, options, useFinalPosition) {
                const position = getRelativePosition(e, chart);
                const axis = options.axis || 'xy';
                const includeInvisible = options.includeInvisible || false;
                return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
            },
     x (chart, e, options, useFinalPosition) {
                const position = getRelativePosition(e, chart);
                return getAxisItems(chart, position, 'x', options.intersect, useFinalPosition);
            },
     y (chart, e, options, useFinalPosition) {
                const position = getRelativePosition(e, chart);
                return getAxisItems(chart, position, 'y', options.intersect, useFinalPosition);
            }
        }
    };

    const STATIC_POSITIONS = [
        'left',
        'top',
        'right',
        'bottom'
    ];
    function filterByPosition(array, position) {
        return array.filter((v)=>v.pos === position);
    }
    function filterDynamicPositionByAxis(array, axis) {
        return array.filter((v)=>STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
    }
    function sortByWeight(array, reverse) {
        return array.sort((a, b)=>{
            const v0 = reverse ? b : a;
            const v1 = reverse ? a : b;
            return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
        });
    }
    function wrapBoxes(boxes) {
        const layoutBoxes = [];
        let i, ilen, box, pos, stack, stackWeight;
        for(i = 0, ilen = (boxes || []).length; i < ilen; ++i){
            box = boxes[i];
            ({ position: pos , options: { stack , stackWeight =1  }  } = box);
            layoutBoxes.push({
                index: i,
                box,
                pos,
                horizontal: box.isHorizontal(),
                weight: box.weight,
                stack: stack && pos + stack,
                stackWeight
            });
        }
        return layoutBoxes;
    }
    function buildStacks(layouts) {
        const stacks = {};
        for (const wrap of layouts){
            const { stack , pos , stackWeight  } = wrap;
            if (!stack || !STATIC_POSITIONS.includes(pos)) {
                continue;
            }
            const _stack = stacks[stack] || (stacks[stack] = {
                count: 0,
                placed: 0,
                weight: 0,
                size: 0
            });
            _stack.count++;
            _stack.weight += stackWeight;
        }
        return stacks;
    }
     function setLayoutDims(layouts, params) {
        const stacks = buildStacks(layouts);
        const { vBoxMaxWidth , hBoxMaxHeight  } = params;
        let i, ilen, layout;
        for(i = 0, ilen = layouts.length; i < ilen; ++i){
            layout = layouts[i];
            const { fullSize  } = layout.box;
            const stack = stacks[layout.stack];
            const factor = stack && layout.stackWeight / stack.weight;
            if (layout.horizontal) {
                layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
                layout.height = hBoxMaxHeight;
            } else {
                layout.width = vBoxMaxWidth;
                layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
            }
        }
        return stacks;
    }
    function buildLayoutBoxes(boxes) {
        const layoutBoxes = wrapBoxes(boxes);
        const fullSize = sortByWeight(layoutBoxes.filter((wrap)=>wrap.box.fullSize), true);
        const left = sortByWeight(filterByPosition(layoutBoxes, 'left'), true);
        const right = sortByWeight(filterByPosition(layoutBoxes, 'right'));
        const top = sortByWeight(filterByPosition(layoutBoxes, 'top'), true);
        const bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom'));
        const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, 'x');
        const centerVertical = filterDynamicPositionByAxis(layoutBoxes, 'y');
        return {
            fullSize,
            leftAndTop: left.concat(top),
            rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
            chartArea: filterByPosition(layoutBoxes, 'chartArea'),
            vertical: left.concat(right).concat(centerVertical),
            horizontal: top.concat(bottom).concat(centerHorizontal)
        };
    }
    function getCombinedMax(maxPadding, chartArea, a, b) {
        return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
    }
    function updateMaxPadding(maxPadding, boxPadding) {
        maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
        maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
        maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
        maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
    }
    function updateDims(chartArea, params, layout, stacks) {
        const { pos , box  } = layout;
        const maxPadding = chartArea.maxPadding;
        if (!isObject(pos)) {
            if (layout.size) {
                chartArea[pos] -= layout.size;
            }
            const stack = stacks[layout.stack] || {
                size: 0,
                count: 1
            };
            stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
            layout.size = stack.size / stack.count;
            chartArea[pos] += layout.size;
        }
        if (box.getPadding) {
            updateMaxPadding(maxPadding, box.getPadding());
        }
        const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, 'left', 'right'));
        const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, 'top', 'bottom'));
        const widthChanged = newWidth !== chartArea.w;
        const heightChanged = newHeight !== chartArea.h;
        chartArea.w = newWidth;
        chartArea.h = newHeight;
        return layout.horizontal ? {
            same: widthChanged,
            other: heightChanged
        } : {
            same: heightChanged,
            other: widthChanged
        };
    }
    function handleMaxPadding(chartArea) {
        const maxPadding = chartArea.maxPadding;
        function updatePos(pos) {
            const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
            chartArea[pos] += change;
            return change;
        }
        chartArea.y += updatePos('top');
        chartArea.x += updatePos('left');
        updatePos('right');
        updatePos('bottom');
    }
    function getMargins(horizontal, chartArea) {
        const maxPadding = chartArea.maxPadding;
        function marginForPositions(positions) {
            const margin = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };
            positions.forEach((pos)=>{
                margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
            });
            return margin;
        }
        return horizontal ? marginForPositions([
            'left',
            'right'
        ]) : marginForPositions([
            'top',
            'bottom'
        ]);
    }
    function fitBoxes(boxes, chartArea, params, stacks) {
        const refitBoxes = [];
        let i, ilen, layout, box, refit, changed;
        for(i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i){
            layout = boxes[i];
            box = layout.box;
            box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
            const { same , other  } = updateDims(chartArea, params, layout, stacks);
            refit |= same && refitBoxes.length;
            changed = changed || other;
            if (!box.fullSize) {
                refitBoxes.push(layout);
            }
        }
        return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
    }
    function setBoxDims(box, left, top, width, height) {
        box.top = top;
        box.left = left;
        box.right = left + width;
        box.bottom = top + height;
        box.width = width;
        box.height = height;
    }
    function placeBoxes(boxes, chartArea, params, stacks) {
        const userPadding = params.padding;
        let { x , y  } = chartArea;
        for (const layout of boxes){
            const box = layout.box;
            const stack = stacks[layout.stack] || {
                count: 1,
                placed: 0,
                weight: 1
            };
            const weight = layout.stackWeight / stack.weight || 1;
            if (layout.horizontal) {
                const width = chartArea.w * weight;
                const height = stack.size || box.height;
                if (defined(stack.start)) {
                    y = stack.start;
                }
                if (box.fullSize) {
                    setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
                } else {
                    setBoxDims(box, chartArea.left + stack.placed, y, width, height);
                }
                stack.start = y;
                stack.placed += width;
                y = box.bottom;
            } else {
                const height = chartArea.h * weight;
                const width = stack.size || box.width;
                if (defined(stack.start)) {
                    x = stack.start;
                }
                if (box.fullSize) {
                    setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
                } else {
                    setBoxDims(box, x, chartArea.top + stack.placed, width, height);
                }
                stack.start = x;
                stack.placed += height;
                x = box.right;
            }
        }
        chartArea.x = x;
        chartArea.y = y;
    }
    var layouts = {
     addBox (chart, item) {
            if (!chart.boxes) {
                chart.boxes = [];
            }
            item.fullSize = item.fullSize || false;
            item.position = item.position || 'top';
            item.weight = item.weight || 0;
            item._layers = item._layers || function() {
                return [
                    {
                        z: 0,
                        draw (chartArea) {
                            item.draw(chartArea);
                        }
                    }
                ];
            };
            chart.boxes.push(item);
        },
     removeBox (chart, layoutItem) {
            const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
            if (index !== -1) {
                chart.boxes.splice(index, 1);
            }
        },
     configure (chart, item, options) {
            item.fullSize = options.fullSize;
            item.position = options.position;
            item.weight = options.weight;
        },
     update (chart, width, height, minPadding) {
            if (!chart) {
                return;
            }
            const padding = toPadding(chart.options.layout.padding);
            const availableWidth = Math.max(width - padding.width, 0);
            const availableHeight = Math.max(height - padding.height, 0);
            const boxes = buildLayoutBoxes(chart.boxes);
            const verticalBoxes = boxes.vertical;
            const horizontalBoxes = boxes.horizontal;
            each(chart.boxes, (box)=>{
                if (typeof box.beforeLayout === 'function') {
                    box.beforeLayout();
                }
            });
            const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap)=>wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
            const params = Object.freeze({
                outerWidth: width,
                outerHeight: height,
                padding,
                availableWidth,
                availableHeight,
                vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
                hBoxMaxHeight: availableHeight / 2
            });
            const maxPadding = Object.assign({}, padding);
            updateMaxPadding(maxPadding, toPadding(minPadding));
            const chartArea = Object.assign({
                maxPadding,
                w: availableWidth,
                h: availableHeight,
                x: padding.left,
                y: padding.top
            }, padding);
            const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
            fitBoxes(boxes.fullSize, chartArea, params, stacks);
            fitBoxes(verticalBoxes, chartArea, params, stacks);
            if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
                fitBoxes(verticalBoxes, chartArea, params, stacks);
            }
            handleMaxPadding(chartArea);
            placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
            chartArea.x += chartArea.w;
            chartArea.y += chartArea.h;
            placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
            chart.chartArea = {
                left: chartArea.left,
                top: chartArea.top,
                right: chartArea.left + chartArea.w,
                bottom: chartArea.top + chartArea.h,
                height: chartArea.h,
                width: chartArea.w
            };
            each(boxes.chartArea, (layout)=>{
                const box = layout.box;
                Object.assign(box, chart.chartArea);
                box.update(chartArea.w, chartArea.h, {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0
                });
            });
        }
    };

    class BasePlatform {
     acquireContext(canvas, aspectRatio) {}
     releaseContext(context) {
            return false;
        }
     addEventListener(chart, type, listener) {}
     removeEventListener(chart, type, listener) {}
     getDevicePixelRatio() {
            return 1;
        }
     getMaximumSize(element, width, height, aspectRatio) {
            width = Math.max(0, width || element.width);
            height = height || element.height;
            return {
                width,
                height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
            };
        }
     isAttached(canvas) {
            return true;
        }
     updateConfig(config) {
        }
    }

    class BasicPlatform extends BasePlatform {
        acquireContext(item) {
            return item && item.getContext && item.getContext('2d') || null;
        }
        updateConfig(config) {
            config.options.animation = false;
        }
    }

    const EXPANDO_KEY = '$chartjs';
     const EVENT_TYPES = {
        touchstart: 'mousedown',
        touchmove: 'mousemove',
        touchend: 'mouseup',
        pointerenter: 'mouseenter',
        pointerdown: 'mousedown',
        pointermove: 'mousemove',
        pointerup: 'mouseup',
        pointerleave: 'mouseout',
        pointerout: 'mouseout'
    };
    const isNullOrEmpty = (value)=>value === null || value === '';
     function initCanvas(canvas, aspectRatio) {
        const style = canvas.style;
        const renderHeight = canvas.getAttribute('height');
        const renderWidth = canvas.getAttribute('width');
        canvas[EXPANDO_KEY] = {
            initial: {
                height: renderHeight,
                width: renderWidth,
                style: {
                    display: style.display,
                    height: style.height,
                    width: style.width
                }
            }
        };
        style.display = style.display || 'block';
        style.boxSizing = style.boxSizing || 'border-box';
        if (isNullOrEmpty(renderWidth)) {
            const displayWidth = readUsedSize(canvas, 'width');
            if (displayWidth !== undefined) {
                canvas.width = displayWidth;
            }
        }
        if (isNullOrEmpty(renderHeight)) {
            if (canvas.style.height === '') {
                canvas.height = canvas.width / (aspectRatio || 2);
            } else {
                const displayHeight = readUsedSize(canvas, 'height');
                if (displayHeight !== undefined) {
                    canvas.height = displayHeight;
                }
            }
        }
        return canvas;
    }
    const eventListenerOptions = supportsEventListenerOptions ? {
        passive: true
    } : false;
    function addListener(node, type, listener) {
        if (node) {
            node.addEventListener(type, listener, eventListenerOptions);
        }
    }
    function removeListener(chart, type, listener) {
        if (chart && chart.canvas) {
            chart.canvas.removeEventListener(type, listener, eventListenerOptions);
        }
    }
    function fromNativeEvent(event, chart) {
        const type = EVENT_TYPES[event.type] || event.type;
        const { x , y  } = getRelativePosition(event, chart);
        return {
            type,
            chart,
            native: event,
            x: x !== undefined ? x : null,
            y: y !== undefined ? y : null
        };
    }
    function nodeListContains(nodeList, canvas) {
        for (const node of nodeList){
            if (node === canvas || node.contains(canvas)) {
                return true;
            }
        }
    }
    function createAttachObserver(chart, type, listener) {
        const canvas = chart.canvas;
        const observer = new MutationObserver((entries)=>{
            let trigger = false;
            for (const entry of entries){
                trigger = trigger || nodeListContains(entry.addedNodes, canvas);
                trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
            }
            if (trigger) {
                listener();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        return observer;
    }
    function createDetachObserver(chart, type, listener) {
        const canvas = chart.canvas;
        const observer = new MutationObserver((entries)=>{
            let trigger = false;
            for (const entry of entries){
                trigger = trigger || nodeListContains(entry.removedNodes, canvas);
                trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
            }
            if (trigger) {
                listener();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        return observer;
    }
    const drpListeningCharts = new Map();
    let oldDevicePixelRatio = 0;
    function onWindowResize() {
        const dpr = window.devicePixelRatio;
        if (dpr === oldDevicePixelRatio) {
            return;
        }
        oldDevicePixelRatio = dpr;
        drpListeningCharts.forEach((resize, chart)=>{
            if (chart.currentDevicePixelRatio !== dpr) {
                resize();
            }
        });
    }
    function listenDevicePixelRatioChanges(chart, resize) {
        if (!drpListeningCharts.size) {
            window.addEventListener('resize', onWindowResize);
        }
        drpListeningCharts.set(chart, resize);
    }
    function unlistenDevicePixelRatioChanges(chart) {
        drpListeningCharts.delete(chart);
        if (!drpListeningCharts.size) {
            window.removeEventListener('resize', onWindowResize);
        }
    }
    function createResizeObserver(chart, type, listener) {
        const canvas = chart.canvas;
        const container = canvas && _getParentNode(canvas);
        if (!container) {
            return;
        }
        const resize = throttled((width, height)=>{
            const w = container.clientWidth;
            listener(width, height);
            if (w < container.clientWidth) {
                listener();
            }
        }, window);
        const observer = new ResizeObserver((entries)=>{
            const entry = entries[0];
            const width = entry.contentRect.width;
            const height = entry.contentRect.height;
            if (width === 0 && height === 0) {
                return;
            }
            resize(width, height);
        });
        observer.observe(container);
        listenDevicePixelRatioChanges(chart, resize);
        return observer;
    }
    function releaseObserver(chart, type, observer) {
        if (observer) {
            observer.disconnect();
        }
        if (type === 'resize') {
            unlistenDevicePixelRatioChanges(chart);
        }
    }
    function createProxyAndListen(chart, type, listener) {
        const canvas = chart.canvas;
        const proxy = throttled((event)=>{
            if (chart.ctx !== null) {
                listener(fromNativeEvent(event, chart));
            }
        }, chart);
        addListener(canvas, type, proxy);
        return proxy;
    }
     class DomPlatform extends BasePlatform {
     acquireContext(canvas, aspectRatio) {
            const context = canvas && canvas.getContext && canvas.getContext('2d');
            if (context && context.canvas === canvas) {
                initCanvas(canvas, aspectRatio);
                return context;
            }
            return null;
        }
     releaseContext(context) {
            const canvas = context.canvas;
            if (!canvas[EXPANDO_KEY]) {
                return false;
            }
            const initial = canvas[EXPANDO_KEY].initial;
            [
                'height',
                'width'
            ].forEach((prop)=>{
                const value = initial[prop];
                if (isNullOrUndef(value)) {
                    canvas.removeAttribute(prop);
                } else {
                    canvas.setAttribute(prop, value);
                }
            });
            const style = initial.style || {};
            Object.keys(style).forEach((key)=>{
                canvas.style[key] = style[key];
            });
            canvas.width = canvas.width;
            delete canvas[EXPANDO_KEY];
            return true;
        }
     addEventListener(chart, type, listener) {
            this.removeEventListener(chart, type);
            const proxies = chart.$proxies || (chart.$proxies = {});
            const handlers = {
                attach: createAttachObserver,
                detach: createDetachObserver,
                resize: createResizeObserver
            };
            const handler = handlers[type] || createProxyAndListen;
            proxies[type] = handler(chart, type, listener);
        }
     removeEventListener(chart, type) {
            const proxies = chart.$proxies || (chart.$proxies = {});
            const proxy = proxies[type];
            if (!proxy) {
                return;
            }
            const handlers = {
                attach: releaseObserver,
                detach: releaseObserver,
                resize: releaseObserver
            };
            const handler = handlers[type] || removeListener;
            handler(chart, type, proxy);
            proxies[type] = undefined;
        }
        getDevicePixelRatio() {
            return window.devicePixelRatio;
        }
     getMaximumSize(canvas, width, height, aspectRatio) {
            return getMaximumSize(canvas, width, height, aspectRatio);
        }
     isAttached(canvas) {
            const container = _getParentNode(canvas);
            return !!(container && container.isConnected);
        }
    }

    function _detectPlatform(canvas) {
        if (!_isDomSupported() || typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
            return BasicPlatform;
        }
        return DomPlatform;
    }

    class Element {
        static defaults = {};
        static defaultRoutes = undefined;
        x;
        y;
        active = false;
        options;
        $animations;
        tooltipPosition(useFinalPosition) {
            const { x , y  } = this.getProps([
                'x',
                'y'
            ], useFinalPosition);
            return {
                x,
                y
            };
        }
        hasValue() {
            return isNumber(this.x) && isNumber(this.y);
        }
        getProps(props, final) {
            const anims = this.$animations;
            if (!final || !anims) {
                // let's not create an object, if not needed
                return this;
            }
            const ret = {};
            props.forEach((prop)=>{
                ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
            });
            return ret;
        }
    }

    function autoSkip(scale, ticks) {
        const tickOpts = scale.options.ticks;
        const determinedMaxTicks = determineMaxTicks(scale);
        const ticksLimit = Math.min(tickOpts.maxTicksLimit || determinedMaxTicks, determinedMaxTicks);
        const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
        const numMajorIndices = majorIndices.length;
        const first = majorIndices[0];
        const last = majorIndices[numMajorIndices - 1];
        const newTicks = [];
        if (numMajorIndices > ticksLimit) {
            skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
            return newTicks;
        }
        const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
        if (numMajorIndices > 0) {
            let i, ilen;
            const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
            skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
            for(i = 0, ilen = numMajorIndices - 1; i < ilen; i++){
                skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
            }
            skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
            return newTicks;
        }
        skip(ticks, newTicks, spacing);
        return newTicks;
    }
    function determineMaxTicks(scale) {
        const offset = scale.options.offset;
        const tickLength = scale._tickSize();
        const maxScale = scale._length / tickLength + (offset ? 0 : 1);
        const maxChart = scale._maxLength / tickLength;
        return Math.floor(Math.min(maxScale, maxChart));
    }
     function calculateSpacing(majorIndices, ticks, ticksLimit) {
        const evenMajorSpacing = getEvenSpacing(majorIndices);
        const spacing = ticks.length / ticksLimit;
        if (!evenMajorSpacing) {
            return Math.max(spacing, 1);
        }
        const factors = _factorize(evenMajorSpacing);
        for(let i = 0, ilen = factors.length - 1; i < ilen; i++){
            const factor = factors[i];
            if (factor > spacing) {
                return factor;
            }
        }
        return Math.max(spacing, 1);
    }
     function getMajorIndices(ticks) {
        const result = [];
        let i, ilen;
        for(i = 0, ilen = ticks.length; i < ilen; i++){
            if (ticks[i].major) {
                result.push(i);
            }
        }
        return result;
    }
     function skipMajors(ticks, newTicks, majorIndices, spacing) {
        let count = 0;
        let next = majorIndices[0];
        let i;
        spacing = Math.ceil(spacing);
        for(i = 0; i < ticks.length; i++){
            if (i === next) {
                newTicks.push(ticks[i]);
                count++;
                next = majorIndices[count * spacing];
            }
        }
    }
     function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
        const start = valueOrDefault(majorStart, 0);
        const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
        let count = 0;
        let length, i, next;
        spacing = Math.ceil(spacing);
        if (majorEnd) {
            length = majorEnd - majorStart;
            spacing = length / Math.floor(length / spacing);
        }
        next = start;
        while(next < 0){
            count++;
            next = Math.round(start + count * spacing);
        }
        for(i = Math.max(start, 0); i < end; i++){
            if (i === next) {
                newTicks.push(ticks[i]);
                count++;
                next = Math.round(start + count * spacing);
            }
        }
    }
     function getEvenSpacing(arr) {
        const len = arr.length;
        let i, diff;
        if (len < 2) {
            return false;
        }
        for(diff = arr[0], i = 1; i < len; ++i){
            if (arr[i] - arr[i - 1] !== diff) {
                return false;
            }
        }
        return diff;
    }

    const reverseAlign = (align)=>align === 'left' ? 'right' : align === 'right' ? 'left' : align;
    const offsetFromEdge = (scale, edge, offset)=>edge === 'top' || edge === 'left' ? scale[edge] + offset : scale[edge] - offset;
    const getTicksLimit = (ticksLength, maxTicksLimit)=>Math.min(maxTicksLimit || ticksLength, ticksLength);
     function sample(arr, numItems) {
        const result = [];
        const increment = arr.length / numItems;
        const len = arr.length;
        let i = 0;
        for(; i < len; i += increment){
            result.push(arr[Math.floor(i)]);
        }
        return result;
    }
     function getPixelForGridLine(scale, index, offsetGridLines) {
        const length = scale.ticks.length;
        const validIndex = Math.min(index, length - 1);
        const start = scale._startPixel;
        const end = scale._endPixel;
        const epsilon = 1e-6;
        let lineValue = scale.getPixelForTick(validIndex);
        let offset;
        if (offsetGridLines) {
            if (length === 1) {
                offset = Math.max(lineValue - start, end - lineValue);
            } else if (index === 0) {
                offset = (scale.getPixelForTick(1) - lineValue) / 2;
            } else {
                offset = (lineValue - scale.getPixelForTick(validIndex - 1)) / 2;
            }
            lineValue += validIndex < index ? offset : -offset;
            if (lineValue < start - epsilon || lineValue > end + epsilon) {
                return;
            }
        }
        return lineValue;
    }
     function garbageCollect(caches, length) {
        each(caches, (cache)=>{
            const gc = cache.gc;
            const gcLen = gc.length / 2;
            let i;
            if (gcLen > length) {
                for(i = 0; i < gcLen; ++i){
                    delete cache.data[gc[i]];
                }
                gc.splice(0, gcLen);
            }
        });
    }
     function getTickMarkLength(options) {
        return options.drawTicks ? options.tickLength : 0;
    }
     function getTitleHeight(options, fallback) {
        if (!options.display) {
            return 0;
        }
        const font = toFont(options.font, fallback);
        const padding = toPadding(options.padding);
        const lines = isArray(options.text) ? options.text.length : 1;
        return lines * font.lineHeight + padding.height;
    }
    function createScaleContext(parent, scale) {
        return createContext(parent, {
            scale,
            type: 'scale'
        });
    }
    function createTickContext(parent, index, tick) {
        return createContext(parent, {
            tick,
            index,
            type: 'tick'
        });
    }
    function titleAlign(align, position, reverse) {
         let ret = _toLeftRightCenter(align);
        if (reverse && position !== 'right' || !reverse && position === 'right') {
            ret = reverseAlign(ret);
        }
        return ret;
    }
    function titleArgs(scale, offset, position, align) {
        const { top , left , bottom , right , chart  } = scale;
        const { chartArea , scales  } = chart;
        let rotation = 0;
        let maxWidth, titleX, titleY;
        const height = bottom - top;
        const width = right - left;
        if (scale.isHorizontal()) {
            titleX = _alignStartEnd(align, left, right);
            if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                titleY = scales[positionAxisID].getPixelForValue(value) + height - offset;
            } else if (position === 'center') {
                titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
            } else {
                titleY = offsetFromEdge(scale, position, offset);
            }
            maxWidth = right - left;
        } else {
            if (isObject(position)) {
                const positionAxisID = Object.keys(position)[0];
                const value = position[positionAxisID];
                titleX = scales[positionAxisID].getPixelForValue(value) - width + offset;
            } else if (position === 'center') {
                titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
            } else {
                titleX = offsetFromEdge(scale, position, offset);
            }
            titleY = _alignStartEnd(align, bottom, top);
            rotation = position === 'left' ? -HALF_PI : HALF_PI;
        }
        return {
            titleX,
            titleY,
            maxWidth,
            rotation
        };
    }
    class Scale extends Element {
        constructor(cfg){
            super();
             this.id = cfg.id;
             this.type = cfg.type;
             this.options = undefined;
             this.ctx = cfg.ctx;
             this.chart = cfg.chart;
             this.top = undefined;
             this.bottom = undefined;
             this.left = undefined;
             this.right = undefined;
             this.width = undefined;
             this.height = undefined;
            this._margins = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
             this.maxWidth = undefined;
             this.maxHeight = undefined;
             this.paddingTop = undefined;
             this.paddingBottom = undefined;
             this.paddingLeft = undefined;
             this.paddingRight = undefined;
             this.axis = undefined;
             this.labelRotation = undefined;
            this.min = undefined;
            this.max = undefined;
            this._range = undefined;
             this.ticks = [];
             this._gridLineItems = null;
             this._labelItems = null;
             this._labelSizes = null;
            this._length = 0;
            this._maxLength = 0;
            this._longestTextCache = {};
             this._startPixel = undefined;
             this._endPixel = undefined;
            this._reversePixels = false;
            this._userMax = undefined;
            this._userMin = undefined;
            this._suggestedMax = undefined;
            this._suggestedMin = undefined;
            this._ticksLength = 0;
            this._borderValue = 0;
            this._cache = {};
            this._dataLimitsCached = false;
            this.$context = undefined;
        }
     init(options) {
            this.options = options.setContext(this.getContext());
            this.axis = options.axis;
            this._userMin = this.parse(options.min);
            this._userMax = this.parse(options.max);
            this._suggestedMin = this.parse(options.suggestedMin);
            this._suggestedMax = this.parse(options.suggestedMax);
        }
     parse(raw, index) {
            return raw;
        }
     getUserBounds() {
            let { _userMin , _userMax , _suggestedMin , _suggestedMax  } = this;
            _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
            _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
            _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
            _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
            return {
                min: finiteOrDefault(_userMin, _suggestedMin),
                max: finiteOrDefault(_userMax, _suggestedMax),
                minDefined: isNumberFinite(_userMin),
                maxDefined: isNumberFinite(_userMax)
            };
        }
     getMinMax(canStack) {
            let { min , max , minDefined , maxDefined  } = this.getUserBounds();
            let range;
            if (minDefined && maxDefined) {
                return {
                    min,
                    max
                };
            }
            const metas = this.getMatchingVisibleMetas();
            for(let i = 0, ilen = metas.length; i < ilen; ++i){
                range = metas[i].controller.getMinMax(this, canStack);
                if (!minDefined) {
                    min = Math.min(min, range.min);
                }
                if (!maxDefined) {
                    max = Math.max(max, range.max);
                }
            }
            min = maxDefined && min > max ? max : min;
            max = minDefined && min > max ? min : max;
            return {
                min: finiteOrDefault(min, finiteOrDefault(max, min)),
                max: finiteOrDefault(max, finiteOrDefault(min, max))
            };
        }
     getPadding() {
            return {
                left: this.paddingLeft || 0,
                top: this.paddingTop || 0,
                right: this.paddingRight || 0,
                bottom: this.paddingBottom || 0
            };
        }
     getTicks() {
            return this.ticks;
        }
     getLabels() {
            const data = this.chart.data;
            return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
        }
     getLabelItems(chartArea = this.chart.chartArea) {
            const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
            return items;
        }
        beforeLayout() {
            this._cache = {};
            this._dataLimitsCached = false;
        }
        beforeUpdate() {
            callback(this.options.beforeUpdate, [
                this
            ]);
        }
     update(maxWidth, maxHeight, margins) {
            const { beginAtZero , grace , ticks: tickOpts  } = this.options;
            const sampleSize = tickOpts.sampleSize;
            this.beforeUpdate();
            this.maxWidth = maxWidth;
            this.maxHeight = maxHeight;
            this._margins = margins = Object.assign({
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, margins);
            this.ticks = null;
            this._labelSizes = null;
            this._gridLineItems = null;
            this._labelItems = null;
            this.beforeSetDimensions();
            this.setDimensions();
            this.afterSetDimensions();
            this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
            if (!this._dataLimitsCached) {
                this.beforeDataLimits();
                this.determineDataLimits();
                this.afterDataLimits();
                this._range = _addGrace(this, grace, beginAtZero);
                this._dataLimitsCached = true;
            }
            this.beforeBuildTicks();
            this.ticks = this.buildTicks() || [];
            this.afterBuildTicks();
            const samplingEnabled = sampleSize < this.ticks.length;
            this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
            this.configure();
            this.beforeCalculateLabelRotation();
            this.calculateLabelRotation();
            this.afterCalculateLabelRotation();
            if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto')) {
                this.ticks = autoSkip(this, this.ticks);
                this._labelSizes = null;
                this.afterAutoSkip();
            }
            if (samplingEnabled) {
                this._convertTicksToLabels(this.ticks);
            }
            this.beforeFit();
            this.fit();
            this.afterFit();
            this.afterUpdate();
        }
     configure() {
            let reversePixels = this.options.reverse;
            let startPixel, endPixel;
            if (this.isHorizontal()) {
                startPixel = this.left;
                endPixel = this.right;
            } else {
                startPixel = this.top;
                endPixel = this.bottom;
                reversePixels = !reversePixels;
            }
            this._startPixel = startPixel;
            this._endPixel = endPixel;
            this._reversePixels = reversePixels;
            this._length = endPixel - startPixel;
            this._alignToPixels = this.options.alignToPixels;
        }
        afterUpdate() {
            callback(this.options.afterUpdate, [
                this
            ]);
        }
        beforeSetDimensions() {
            callback(this.options.beforeSetDimensions, [
                this
            ]);
        }
        setDimensions() {
            if (this.isHorizontal()) {
                this.width = this.maxWidth;
                this.left = 0;
                this.right = this.width;
            } else {
                this.height = this.maxHeight;
                this.top = 0;
                this.bottom = this.height;
            }
            this.paddingLeft = 0;
            this.paddingTop = 0;
            this.paddingRight = 0;
            this.paddingBottom = 0;
        }
        afterSetDimensions() {
            callback(this.options.afterSetDimensions, [
                this
            ]);
        }
        _callHooks(name) {
            this.chart.notifyPlugins(name, this.getContext());
            callback(this.options[name], [
                this
            ]);
        }
        beforeDataLimits() {
            this._callHooks('beforeDataLimits');
        }
        determineDataLimits() {}
        afterDataLimits() {
            this._callHooks('afterDataLimits');
        }
        beforeBuildTicks() {
            this._callHooks('beforeBuildTicks');
        }
     buildTicks() {
            return [];
        }
        afterBuildTicks() {
            this._callHooks('afterBuildTicks');
        }
        beforeTickToLabelConversion() {
            callback(this.options.beforeTickToLabelConversion, [
                this
            ]);
        }
     generateTickLabels(ticks) {
            const tickOpts = this.options.ticks;
            let i, ilen, tick;
            for(i = 0, ilen = ticks.length; i < ilen; i++){
                tick = ticks[i];
                tick.label = callback(tickOpts.callback, [
                    tick.value,
                    i,
                    ticks
                ], this);
            }
        }
        afterTickToLabelConversion() {
            callback(this.options.afterTickToLabelConversion, [
                this
            ]);
        }
        beforeCalculateLabelRotation() {
            callback(this.options.beforeCalculateLabelRotation, [
                this
            ]);
        }
        calculateLabelRotation() {
            const options = this.options;
            const tickOpts = options.ticks;
            const numTicks = getTicksLimit(this.ticks.length, options.ticks.maxTicksLimit);
            const minRotation = tickOpts.minRotation || 0;
            const maxRotation = tickOpts.maxRotation;
            let labelRotation = minRotation;
            let tickWidth, maxHeight, maxLabelDiagonal;
            if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
                this.labelRotation = minRotation;
                return;
            }
            const labelSizes = this._getLabelSizes();
            const maxLabelWidth = labelSizes.widest.width;
            const maxLabelHeight = labelSizes.highest.height;
            const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
            tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
            if (maxLabelWidth + 6 > tickWidth) {
                tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
                maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
                maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
                labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
                labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
            }
            this.labelRotation = labelRotation;
        }
        afterCalculateLabelRotation() {
            callback(this.options.afterCalculateLabelRotation, [
                this
            ]);
        }
        afterAutoSkip() {}
        beforeFit() {
            callback(this.options.beforeFit, [
                this
            ]);
        }
        fit() {
            const minSize = {
                width: 0,
                height: 0
            };
            const { chart , options: { ticks: tickOpts , title: titleOpts , grid: gridOpts  }  } = this;
            const display = this._isVisible();
            const isHorizontal = this.isHorizontal();
            if (display) {
                const titleHeight = getTitleHeight(titleOpts, chart.options.font);
                if (isHorizontal) {
                    minSize.width = this.maxWidth;
                    minSize.height = getTickMarkLength(gridOpts) + titleHeight;
                } else {
                    minSize.height = this.maxHeight;
                    minSize.width = getTickMarkLength(gridOpts) + titleHeight;
                }
                if (tickOpts.display && this.ticks.length) {
                    const { first , last , widest , highest  } = this._getLabelSizes();
                    const tickPadding = tickOpts.padding * 2;
                    const angleRadians = toRadians(this.labelRotation);
                    const cos = Math.cos(angleRadians);
                    const sin = Math.sin(angleRadians);
                    if (isHorizontal) {
                        const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
                        minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
                    } else {
                        const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
                        minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
                    }
                    this._calculatePadding(first, last, sin, cos);
                }
            }
            this._handleMargins();
            if (isHorizontal) {
                this.width = this._length = chart.width - this._margins.left - this._margins.right;
                this.height = minSize.height;
            } else {
                this.width = minSize.width;
                this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
            }
        }
        _calculatePadding(first, last, sin, cos) {
            const { ticks: { align , padding  } , position  } = this.options;
            const isRotated = this.labelRotation !== 0;
            const labelsBelowTicks = position !== 'top' && this.axis === 'x';
            if (this.isHorizontal()) {
                const offsetLeft = this.getPixelForTick(0) - this.left;
                const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
                let paddingLeft = 0;
                let paddingRight = 0;
                if (isRotated) {
                    if (labelsBelowTicks) {
                        paddingLeft = cos * first.width;
                        paddingRight = sin * last.height;
                    } else {
                        paddingLeft = sin * first.height;
                        paddingRight = cos * last.width;
                    }
                } else if (align === 'start') {
                    paddingRight = last.width;
                } else if (align === 'end') {
                    paddingLeft = first.width;
                } else if (align !== 'inner') {
                    paddingLeft = first.width / 2;
                    paddingRight = last.width / 2;
                }
                this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
                this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
            } else {
                let paddingTop = last.height / 2;
                let paddingBottom = first.height / 2;
                if (align === 'start') {
                    paddingTop = 0;
                    paddingBottom = first.height;
                } else if (align === 'end') {
                    paddingTop = last.height;
                    paddingBottom = 0;
                }
                this.paddingTop = paddingTop + padding;
                this.paddingBottom = paddingBottom + padding;
            }
        }
     _handleMargins() {
            if (this._margins) {
                this._margins.left = Math.max(this.paddingLeft, this._margins.left);
                this._margins.top = Math.max(this.paddingTop, this._margins.top);
                this._margins.right = Math.max(this.paddingRight, this._margins.right);
                this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
            }
        }
        afterFit() {
            callback(this.options.afterFit, [
                this
            ]);
        }
     isHorizontal() {
            const { axis , position  } = this.options;
            return position === 'top' || position === 'bottom' || axis === 'x';
        }
     isFullSize() {
            return this.options.fullSize;
        }
     _convertTicksToLabels(ticks) {
            this.beforeTickToLabelConversion();
            this.generateTickLabels(ticks);
            let i, ilen;
            for(i = 0, ilen = ticks.length; i < ilen; i++){
                if (isNullOrUndef(ticks[i].label)) {
                    ticks.splice(i, 1);
                    ilen--;
                    i--;
                }
            }
            this.afterTickToLabelConversion();
        }
     _getLabelSizes() {
            let labelSizes = this._labelSizes;
            if (!labelSizes) {
                const sampleSize = this.options.ticks.sampleSize;
                let ticks = this.ticks;
                if (sampleSize < ticks.length) {
                    ticks = sample(ticks, sampleSize);
                }
                this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.maxTicksLimit);
            }
            return labelSizes;
        }
     _computeLabelSizes(ticks, length, maxTicksLimit) {
            const { ctx , _longestTextCache: caches  } = this;
            const widths = [];
            const heights = [];
            const increment = Math.floor(length / getTicksLimit(length, maxTicksLimit));
            let widestLabelSize = 0;
            let highestLabelSize = 0;
            let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
            for(i = 0; i < length; i += increment){
                label = ticks[i].label;
                tickFont = this._resolveTickFontOptions(i);
                ctx.font = fontString = tickFont.string;
                cache = caches[fontString] = caches[fontString] || {
                    data: {},
                    gc: []
                };
                lineHeight = tickFont.lineHeight;
                width = height = 0;
                if (!isNullOrUndef(label) && !isArray(label)) {
                    width = _measureText(ctx, cache.data, cache.gc, width, label);
                    height = lineHeight;
                } else if (isArray(label)) {
                    for(j = 0, jlen = label.length; j < jlen; ++j){
                        nestedLabel =  label[j];
                        if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
                            width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
                            height += lineHeight;
                        }
                    }
                }
                widths.push(width);
                heights.push(height);
                widestLabelSize = Math.max(width, widestLabelSize);
                highestLabelSize = Math.max(height, highestLabelSize);
            }
            garbageCollect(caches, length);
            const widest = widths.indexOf(widestLabelSize);
            const highest = heights.indexOf(highestLabelSize);
            const valueAt = (idx)=>({
                    width: widths[idx] || 0,
                    height: heights[idx] || 0
                });
            return {
                first: valueAt(0),
                last: valueAt(length - 1),
                widest: valueAt(widest),
                highest: valueAt(highest),
                widths,
                heights
            };
        }
     getLabelForValue(value) {
            return value;
        }
     getPixelForValue(value, index) {
            return NaN;
        }
     getValueForPixel(pixel) {}
     getPixelForTick(index) {
            const ticks = this.ticks;
            if (index < 0 || index > ticks.length - 1) {
                return null;
            }
            return this.getPixelForValue(ticks[index].value);
        }
     getPixelForDecimal(decimal) {
            if (this._reversePixels) {
                decimal = 1 - decimal;
            }
            const pixel = this._startPixel + decimal * this._length;
            return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
        }
     getDecimalForPixel(pixel) {
            const decimal = (pixel - this._startPixel) / this._length;
            return this._reversePixels ? 1 - decimal : decimal;
        }
     getBasePixel() {
            return this.getPixelForValue(this.getBaseValue());
        }
     getBaseValue() {
            const { min , max  } = this;
            return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
        }
     getContext(index) {
            const ticks = this.ticks || [];
            if (index >= 0 && index < ticks.length) {
                const tick = ticks[index];
                return tick.$context || (tick.$context = createTickContext(this.getContext(), index, tick));
            }
            return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
        }
     _tickSize() {
            const optionTicks = this.options.ticks;
            const rot = toRadians(this.labelRotation);
            const cos = Math.abs(Math.cos(rot));
            const sin = Math.abs(Math.sin(rot));
            const labelSizes = this._getLabelSizes();
            const padding = optionTicks.autoSkipPadding || 0;
            const w = labelSizes ? labelSizes.widest.width + padding : 0;
            const h = labelSizes ? labelSizes.highest.height + padding : 0;
            return this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
        }
     _isVisible() {
            const display = this.options.display;
            if (display !== 'auto') {
                return !!display;
            }
            return this.getMatchingVisibleMetas().length > 0;
        }
     _computeGridLineItems(chartArea) {
            const axis = this.axis;
            const chart = this.chart;
            const options = this.options;
            const { grid , position , border  } = options;
            const offset = grid.offset;
            const isHorizontal = this.isHorizontal();
            const ticks = this.ticks;
            const ticksLength = ticks.length + (offset ? 1 : 0);
            const tl = getTickMarkLength(grid);
            const items = [];
            const borderOpts = border.setContext(this.getContext());
            const axisWidth = borderOpts.display ? borderOpts.width : 0;
            const axisHalfWidth = axisWidth / 2;
            const alignBorderValue = function(pixel) {
                return _alignPixel(chart, pixel, axisWidth);
            };
            let borderValue, i, lineValue, alignedLineValue;
            let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
            if (position === 'top') {
                borderValue = alignBorderValue(this.bottom);
                ty1 = this.bottom - tl;
                ty2 = borderValue - axisHalfWidth;
                y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
                y2 = chartArea.bottom;
            } else if (position === 'bottom') {
                borderValue = alignBorderValue(this.top);
                y1 = chartArea.top;
                y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
                ty1 = borderValue + axisHalfWidth;
                ty2 = this.top + tl;
            } else if (position === 'left') {
                borderValue = alignBorderValue(this.right);
                tx1 = this.right - tl;
                tx2 = borderValue - axisHalfWidth;
                x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
                x2 = chartArea.right;
            } else if (position === 'right') {
                borderValue = alignBorderValue(this.left);
                x1 = chartArea.left;
                x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
                tx1 = borderValue + axisHalfWidth;
                tx2 = this.left + tl;
            } else if (axis === 'x') {
                if (position === 'center') {
                    borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
                } else if (isObject(position)) {
                    const positionAxisID = Object.keys(position)[0];
                    const value = position[positionAxisID];
                    borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
                }
                y1 = chartArea.top;
                y2 = chartArea.bottom;
                ty1 = borderValue + axisHalfWidth;
                ty2 = ty1 + tl;
            } else if (axis === 'y') {
                if (position === 'center') {
                    borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
                } else if (isObject(position)) {
                    const positionAxisID = Object.keys(position)[0];
                    const value = position[positionAxisID];
                    borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
                }
                tx1 = borderValue - axisHalfWidth;
                tx2 = tx1 - tl;
                x1 = chartArea.left;
                x2 = chartArea.right;
            }
            const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
            const step = Math.max(1, Math.ceil(ticksLength / limit));
            for(i = 0; i < ticksLength; i += step){
                const context = this.getContext(i);
                const optsAtIndex = grid.setContext(context);
                const optsAtIndexBorder = border.setContext(context);
                const lineWidth = optsAtIndex.lineWidth;
                const lineColor = optsAtIndex.color;
                const borderDash = optsAtIndexBorder.dash || [];
                const borderDashOffset = optsAtIndexBorder.dashOffset;
                const tickWidth = optsAtIndex.tickWidth;
                const tickColor = optsAtIndex.tickColor;
                const tickBorderDash = optsAtIndex.tickBorderDash || [];
                const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
                lineValue = getPixelForGridLine(this, i, offset);
                if (lineValue === undefined) {
                    continue;
                }
                alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
                if (isHorizontal) {
                    tx1 = tx2 = x1 = x2 = alignedLineValue;
                } else {
                    ty1 = ty2 = y1 = y2 = alignedLineValue;
                }
                items.push({
                    tx1,
                    ty1,
                    tx2,
                    ty2,
                    x1,
                    y1,
                    x2,
                    y2,
                    width: lineWidth,
                    color: lineColor,
                    borderDash,
                    borderDashOffset,
                    tickWidth,
                    tickColor,
                    tickBorderDash,
                    tickBorderDashOffset
                });
            }
            this._ticksLength = ticksLength;
            this._borderValue = borderValue;
            return items;
        }
     _computeLabelItems(chartArea) {
            const axis = this.axis;
            const options = this.options;
            const { position , ticks: optionTicks  } = options;
            const isHorizontal = this.isHorizontal();
            const ticks = this.ticks;
            const { align , crossAlign , padding , mirror  } = optionTicks;
            const tl = getTickMarkLength(options.grid);
            const tickAndPadding = tl + padding;
            const hTickAndPadding = mirror ? -padding : tickAndPadding;
            const rotation = -toRadians(this.labelRotation);
            const items = [];
            let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
            let textBaseline = 'middle';
            if (position === 'top') {
                y = this.bottom - hTickAndPadding;
                textAlign = this._getXAxisLabelAlignment();
            } else if (position === 'bottom') {
                y = this.top + hTickAndPadding;
                textAlign = this._getXAxisLabelAlignment();
            } else if (position === 'left') {
                const ret = this._getYAxisLabelAlignment(tl);
                textAlign = ret.textAlign;
                x = ret.x;
            } else if (position === 'right') {
                const ret = this._getYAxisLabelAlignment(tl);
                textAlign = ret.textAlign;
                x = ret.x;
            } else if (axis === 'x') {
                if (position === 'center') {
                    y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
                } else if (isObject(position)) {
                    const positionAxisID = Object.keys(position)[0];
                    const value = position[positionAxisID];
                    y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
                }
                textAlign = this._getXAxisLabelAlignment();
            } else if (axis === 'y') {
                if (position === 'center') {
                    x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
                } else if (isObject(position)) {
                    const positionAxisID = Object.keys(position)[0];
                    const value = position[positionAxisID];
                    x = this.chart.scales[positionAxisID].getPixelForValue(value);
                }
                textAlign = this._getYAxisLabelAlignment(tl).textAlign;
            }
            if (axis === 'y') {
                if (align === 'start') {
                    textBaseline = 'top';
                } else if (align === 'end') {
                    textBaseline = 'bottom';
                }
            }
            const labelSizes = this._getLabelSizes();
            for(i = 0, ilen = ticks.length; i < ilen; ++i){
                tick = ticks[i];
                label = tick.label;
                const optsAtIndex = optionTicks.setContext(this.getContext(i));
                pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
                font = this._resolveTickFontOptions(i);
                lineHeight = font.lineHeight;
                lineCount = isArray(label) ? label.length : 1;
                const halfCount = lineCount / 2;
                const color = optsAtIndex.color;
                const strokeColor = optsAtIndex.textStrokeColor;
                const strokeWidth = optsAtIndex.textStrokeWidth;
                let tickTextAlign = textAlign;
                if (isHorizontal) {
                    x = pixel;
                    if (textAlign === 'inner') {
                        if (i === ilen - 1) {
                            tickTextAlign = !this.options.reverse ? 'right' : 'left';
                        } else if (i === 0) {
                            tickTextAlign = !this.options.reverse ? 'left' : 'right';
                        } else {
                            tickTextAlign = 'center';
                        }
                    }
                    if (position === 'top') {
                        if (crossAlign === 'near' || rotation !== 0) {
                            textOffset = -lineCount * lineHeight + lineHeight / 2;
                        } else if (crossAlign === 'center') {
                            textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
                        } else {
                            textOffset = -labelSizes.highest.height + lineHeight / 2;
                        }
                    } else {
                        if (crossAlign === 'near' || rotation !== 0) {
                            textOffset = lineHeight / 2;
                        } else if (crossAlign === 'center') {
                            textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
                        } else {
                            textOffset = labelSizes.highest.height - lineCount * lineHeight;
                        }
                    }
                    if (mirror) {
                        textOffset *= -1;
                    }
                    if (rotation !== 0 && !optsAtIndex.showLabelBackdrop) {
                        x += lineHeight / 2 * Math.sin(rotation);
                    }
                } else {
                    y = pixel;
                    textOffset = (1 - lineCount) * lineHeight / 2;
                }
                let backdrop;
                if (optsAtIndex.showLabelBackdrop) {
                    const labelPadding = toPadding(optsAtIndex.backdropPadding);
                    const height = labelSizes.heights[i];
                    const width = labelSizes.widths[i];
                    let top = textOffset - labelPadding.top;
                    let left = 0 - labelPadding.left;
                    switch(textBaseline){
                        case 'middle':
                            top -= height / 2;
                            break;
                        case 'bottom':
                            top -= height;
                            break;
                    }
                    switch(textAlign){
                        case 'center':
                            left -= width / 2;
                            break;
                        case 'right':
                            left -= width;
                            break;
                        case 'inner':
                            if (i === ilen - 1) {
                                left -= width;
                            } else if (i > 0) {
                                left -= width / 2;
                            }
                            break;
                    }
                    backdrop = {
                        left,
                        top,
                        width: width + labelPadding.width,
                        height: height + labelPadding.height,
                        color: optsAtIndex.backdropColor
                    };
                }
                items.push({
                    label,
                    font,
                    textOffset,
                    options: {
                        rotation,
                        color,
                        strokeColor,
                        strokeWidth,
                        textAlign: tickTextAlign,
                        textBaseline,
                        translation: [
                            x,
                            y
                        ],
                        backdrop
                    }
                });
            }
            return items;
        }
        _getXAxisLabelAlignment() {
            const { position , ticks  } = this.options;
            const rotation = -toRadians(this.labelRotation);
            if (rotation) {
                return position === 'top' ? 'left' : 'right';
            }
            let align = 'center';
            if (ticks.align === 'start') {
                align = 'left';
            } else if (ticks.align === 'end') {
                align = 'right';
            } else if (ticks.align === 'inner') {
                align = 'inner';
            }
            return align;
        }
        _getYAxisLabelAlignment(tl) {
            const { position , ticks: { crossAlign , mirror , padding  }  } = this.options;
            const labelSizes = this._getLabelSizes();
            const tickAndPadding = tl + padding;
            const widest = labelSizes.widest.width;
            let textAlign;
            let x;
            if (position === 'left') {
                if (mirror) {
                    x = this.right + padding;
                    if (crossAlign === 'near') {
                        textAlign = 'left';
                    } else if (crossAlign === 'center') {
                        textAlign = 'center';
                        x += widest / 2;
                    } else {
                        textAlign = 'right';
                        x += widest;
                    }
                } else {
                    x = this.right - tickAndPadding;
                    if (crossAlign === 'near') {
                        textAlign = 'right';
                    } else if (crossAlign === 'center') {
                        textAlign = 'center';
                        x -= widest / 2;
                    } else {
                        textAlign = 'left';
                        x = this.left;
                    }
                }
            } else if (position === 'right') {
                if (mirror) {
                    x = this.left + padding;
                    if (crossAlign === 'near') {
                        textAlign = 'right';
                    } else if (crossAlign === 'center') {
                        textAlign = 'center';
                        x -= widest / 2;
                    } else {
                        textAlign = 'left';
                        x -= widest;
                    }
                } else {
                    x = this.left + tickAndPadding;
                    if (crossAlign === 'near') {
                        textAlign = 'left';
                    } else if (crossAlign === 'center') {
                        textAlign = 'center';
                        x += widest / 2;
                    } else {
                        textAlign = 'right';
                        x = this.right;
                    }
                }
            } else {
                textAlign = 'right';
            }
            return {
                textAlign,
                x
            };
        }
     _computeLabelArea() {
            if (this.options.ticks.mirror) {
                return;
            }
            const chart = this.chart;
            const position = this.options.position;
            if (position === 'left' || position === 'right') {
                return {
                    top: 0,
                    left: this.left,
                    bottom: chart.height,
                    right: this.right
                };
            }
            if (position === 'top' || position === 'bottom') {
                return {
                    top: this.top,
                    left: 0,
                    bottom: this.bottom,
                    right: chart.width
                };
            }
        }
     drawBackground() {
            const { ctx , options: { backgroundColor  } , left , top , width , height  } = this;
            if (backgroundColor) {
                ctx.save();
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(left, top, width, height);
                ctx.restore();
            }
        }
        getLineWidthForValue(value) {
            const grid = this.options.grid;
            if (!this._isVisible() || !grid.display) {
                return 0;
            }
            const ticks = this.ticks;
            const index = ticks.findIndex((t)=>t.value === value);
            if (index >= 0) {
                const opts = grid.setContext(this.getContext(index));
                return opts.lineWidth;
            }
            return 0;
        }
     drawGrid(chartArea) {
            const grid = this.options.grid;
            const ctx = this.ctx;
            const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
            let i, ilen;
            const drawLine = (p1, p2, style)=>{
                if (!style.width || !style.color) {
                    return;
                }
                ctx.save();
                ctx.lineWidth = style.width;
                ctx.strokeStyle = style.color;
                ctx.setLineDash(style.borderDash || []);
                ctx.lineDashOffset = style.borderDashOffset;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.restore();
            };
            if (grid.display) {
                for(i = 0, ilen = items.length; i < ilen; ++i){
                    const item = items[i];
                    if (grid.drawOnChartArea) {
                        drawLine({
                            x: item.x1,
                            y: item.y1
                        }, {
                            x: item.x2,
                            y: item.y2
                        }, item);
                    }
                    if (grid.drawTicks) {
                        drawLine({
                            x: item.tx1,
                            y: item.ty1
                        }, {
                            x: item.tx2,
                            y: item.ty2
                        }, {
                            color: item.tickColor,
                            width: item.tickWidth,
                            borderDash: item.tickBorderDash,
                            borderDashOffset: item.tickBorderDashOffset
                        });
                    }
                }
            }
        }
     drawBorder() {
            const { chart , ctx , options: { border , grid  }  } = this;
            const borderOpts = border.setContext(this.getContext());
            const axisWidth = border.display ? borderOpts.width : 0;
            if (!axisWidth) {
                return;
            }
            const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
            const borderValue = this._borderValue;
            let x1, x2, y1, y2;
            if (this.isHorizontal()) {
                x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
                x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
                y1 = y2 = borderValue;
            } else {
                y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
                y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
                x1 = x2 = borderValue;
            }
            ctx.save();
            ctx.lineWidth = borderOpts.width;
            ctx.strokeStyle = borderOpts.color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
        }
     drawLabels(chartArea) {
            const optionTicks = this.options.ticks;
            if (!optionTicks.display) {
                return;
            }
            const ctx = this.ctx;
            const area = this._computeLabelArea();
            if (area) {
                clipArea(ctx, area);
            }
            const items = this.getLabelItems(chartArea);
            for (const item of items){
                const renderTextOptions = item.options;
                const tickFont = item.font;
                const label = item.label;
                const y = item.textOffset;
                renderText(ctx, label, 0, y, tickFont, renderTextOptions);
            }
            if (area) {
                unclipArea(ctx);
            }
        }
     drawTitle() {
            const { ctx , options: { position , title , reverse  }  } = this;
            if (!title.display) {
                return;
            }
            const font = toFont(title.font);
            const padding = toPadding(title.padding);
            const align = title.align;
            let offset = font.lineHeight / 2;
            if (position === 'bottom' || position === 'center' || isObject(position)) {
                offset += padding.bottom;
                if (isArray(title.text)) {
                    offset += font.lineHeight * (title.text.length - 1);
                }
            } else {
                offset += padding.top;
            }
            const { titleX , titleY , maxWidth , rotation  } = titleArgs(this, offset, position, align);
            renderText(ctx, title.text, 0, 0, font, {
                color: title.color,
                maxWidth,
                rotation,
                textAlign: titleAlign(align, position, reverse),
                textBaseline: 'middle',
                translation: [
                    titleX,
                    titleY
                ]
            });
        }
        draw(chartArea) {
            if (!this._isVisible()) {
                return;
            }
            this.drawBackground();
            this.drawGrid(chartArea);
            this.drawBorder();
            this.drawTitle();
            this.drawLabels(chartArea);
        }
     _layers() {
            const opts = this.options;
            const tz = opts.ticks && opts.ticks.z || 0;
            const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
            const bz = valueOrDefault(opts.border && opts.border.z, 0);
            if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
                return [
                    {
                        z: tz,
                        draw: (chartArea)=>{
                            this.draw(chartArea);
                        }
                    }
                ];
            }
            return [
                {
                    z: gz,
                    draw: (chartArea)=>{
                        this.drawBackground();
                        this.drawGrid(chartArea);
                        this.drawTitle();
                    }
                },
                {
                    z: bz,
                    draw: ()=>{
                        this.drawBorder();
                    }
                },
                {
                    z: tz,
                    draw: (chartArea)=>{
                        this.drawLabels(chartArea);
                    }
                }
            ];
        }
     getMatchingVisibleMetas(type) {
            const metas = this.chart.getSortedVisibleDatasetMetas();
            const axisID = this.axis + 'AxisID';
            const result = [];
            let i, ilen;
            for(i = 0, ilen = metas.length; i < ilen; ++i){
                const meta = metas[i];
                if (meta[axisID] === this.id && (!type || meta.type === type)) {
                    result.push(meta);
                }
            }
            return result;
        }
     _resolveTickFontOptions(index) {
            const opts = this.options.ticks.setContext(this.getContext(index));
            return toFont(opts.font);
        }
     _maxDigits() {
            const fontSize = this._resolveTickFontOptions(0).lineHeight;
            return (this.isHorizontal() ? this.width : this.height) / fontSize;
        }
    }

    class TypedRegistry {
        constructor(type, scope, override){
            this.type = type;
            this.scope = scope;
            this.override = override;
            this.items = Object.create(null);
        }
        isForType(type) {
            return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
        }
     register(item) {
            const proto = Object.getPrototypeOf(item);
            let parentScope;
            if (isIChartComponent(proto)) {
                parentScope = this.register(proto);
            }
            const items = this.items;
            const id = item.id;
            const scope = this.scope + '.' + id;
            if (!id) {
                throw new Error('class does not have id: ' + item);
            }
            if (id in items) {
                return scope;
            }
            items[id] = item;
            registerDefaults(item, scope, parentScope);
            if (this.override) {
                defaults.override(item.id, item.overrides);
            }
            return scope;
        }
     get(id) {
            return this.items[id];
        }
     unregister(item) {
            const items = this.items;
            const id = item.id;
            const scope = this.scope;
            if (id in items) {
                delete items[id];
            }
            if (scope && id in defaults[scope]) {
                delete defaults[scope][id];
                if (this.override) {
                    delete overrides[id];
                }
            }
        }
    }
    function registerDefaults(item, scope, parentScope) {
        const itemDefaults = merge(Object.create(null), [
            parentScope ? defaults.get(parentScope) : {},
            defaults.get(scope),
            item.defaults
        ]);
        defaults.set(scope, itemDefaults);
        if (item.defaultRoutes) {
            routeDefaults(scope, item.defaultRoutes);
        }
        if (item.descriptors) {
            defaults.describe(scope, item.descriptors);
        }
    }
    function routeDefaults(scope, routes) {
        Object.keys(routes).forEach((property)=>{
            const propertyParts = property.split('.');
            const sourceName = propertyParts.pop();
            const sourceScope = [
                scope
            ].concat(propertyParts).join('.');
            const parts = routes[property].split('.');
            const targetName = parts.pop();
            const targetScope = parts.join('.');
            defaults.route(sourceScope, sourceName, targetScope, targetName);
        });
    }
    function isIChartComponent(proto) {
        return 'id' in proto && 'defaults' in proto;
    }

    class Registry {
        constructor(){
            this.controllers = new TypedRegistry(DatasetController, 'datasets', true);
            this.elements = new TypedRegistry(Element, 'elements');
            this.plugins = new TypedRegistry(Object, 'plugins');
            this.scales = new TypedRegistry(Scale, 'scales');
            this._typedRegistries = [
                this.controllers,
                this.scales,
                this.elements
            ];
        }
     add(...args) {
            this._each('register', args);
        }
        remove(...args) {
            this._each('unregister', args);
        }
     addControllers(...args) {
            this._each('register', args, this.controllers);
        }
     addElements(...args) {
            this._each('register', args, this.elements);
        }
     addPlugins(...args) {
            this._each('register', args, this.plugins);
        }
     addScales(...args) {
            this._each('register', args, this.scales);
        }
     getController(id) {
            return this._get(id, this.controllers, 'controller');
        }
     getElement(id) {
            return this._get(id, this.elements, 'element');
        }
     getPlugin(id) {
            return this._get(id, this.plugins, 'plugin');
        }
     getScale(id) {
            return this._get(id, this.scales, 'scale');
        }
     removeControllers(...args) {
            this._each('unregister', args, this.controllers);
        }
     removeElements(...args) {
            this._each('unregister', args, this.elements);
        }
     removePlugins(...args) {
            this._each('unregister', args, this.plugins);
        }
     removeScales(...args) {
            this._each('unregister', args, this.scales);
        }
     _each(method, args, typedRegistry) {
            [
                ...args
            ].forEach((arg)=>{
                const reg = typedRegistry || this._getRegistryForType(arg);
                if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
                    this._exec(method, reg, arg);
                } else {
                    each(arg, (item)=>{
                        const itemReg = typedRegistry || this._getRegistryForType(item);
                        this._exec(method, itemReg, item);
                    });
                }
            });
        }
     _exec(method, registry, component) {
            const camelMethod = _capitalize(method);
            callback(component['before' + camelMethod], [], component);
            registry[method](component);
            callback(component['after' + camelMethod], [], component);
        }
     _getRegistryForType(type) {
            for(let i = 0; i < this._typedRegistries.length; i++){
                const reg = this._typedRegistries[i];
                if (reg.isForType(type)) {
                    return reg;
                }
            }
            return this.plugins;
        }
     _get(id, typedRegistry, type) {
            const item = typedRegistry.get(id);
            if (item === undefined) {
                throw new Error('"' + id + '" is not a registered ' + type + '.');
            }
            return item;
        }
    }
    var registry = /* #__PURE__ */ new Registry();

    class PluginService {
        constructor(){
            this._init = [];
        }
     notify(chart, hook, args, filter) {
            if (hook === 'beforeInit') {
                this._init = this._createDescriptors(chart, true);
                this._notify(this._init, chart, 'install');
            }
            const descriptors = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
            const result = this._notify(descriptors, chart, hook, args);
            if (hook === 'afterDestroy') {
                this._notify(descriptors, chart, 'stop');
                this._notify(this._init, chart, 'uninstall');
            }
            return result;
        }
     _notify(descriptors, chart, hook, args) {
            args = args || {};
            for (const descriptor of descriptors){
                const plugin = descriptor.plugin;
                const method = plugin[hook];
                const params = [
                    chart,
                    args,
                    descriptor.options
                ];
                if (callback(method, params, plugin) === false && args.cancelable) {
                    return false;
                }
            }
            return true;
        }
        invalidate() {
            if (!isNullOrUndef(this._cache)) {
                this._oldCache = this._cache;
                this._cache = undefined;
            }
        }
     _descriptors(chart) {
            if (this._cache) {
                return this._cache;
            }
            const descriptors = this._cache = this._createDescriptors(chart);
            this._notifyStateChanges(chart);
            return descriptors;
        }
        _createDescriptors(chart, all) {
            const config = chart && chart.config;
            const options = valueOrDefault(config.options && config.options.plugins, {});
            const plugins = allPlugins(config);
            return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
        }
     _notifyStateChanges(chart) {
            const previousDescriptors = this._oldCache || [];
            const descriptors = this._cache;
            const diff = (a, b)=>a.filter((x)=>!b.some((y)=>x.plugin.id === y.plugin.id));
            this._notify(diff(previousDescriptors, descriptors), chart, 'stop');
            this._notify(diff(descriptors, previousDescriptors), chart, 'start');
        }
    }
     function allPlugins(config) {
        const localIds = {};
        const plugins = [];
        const keys = Object.keys(registry.plugins.items);
        for(let i = 0; i < keys.length; i++){
            plugins.push(registry.getPlugin(keys[i]));
        }
        const local = config.plugins || [];
        for(let i = 0; i < local.length; i++){
            const plugin = local[i];
            if (plugins.indexOf(plugin) === -1) {
                plugins.push(plugin);
                localIds[plugin.id] = true;
            }
        }
        return {
            plugins,
            localIds
        };
    }
    function getOpts(options, all) {
        if (!all && options === false) {
            return null;
        }
        if (options === true) {
            return {};
        }
        return options;
    }
    function createDescriptors(chart, { plugins , localIds  }, options, all) {
        const result = [];
        const context = chart.getContext();
        for (const plugin of plugins){
            const id = plugin.id;
            const opts = getOpts(options[id], all);
            if (opts === null) {
                continue;
            }
            result.push({
                plugin,
                options: pluginOpts(chart.config, {
                    plugin,
                    local: localIds[id]
                }, opts, context)
            });
        }
        return result;
    }
    function pluginOpts(config, { plugin , local  }, opts, context) {
        const keys = config.pluginScopeKeys(plugin);
        const scopes = config.getOptionScopes(opts, keys);
        if (local && plugin.defaults) {
            scopes.push(plugin.defaults);
        }
        return config.createResolver(scopes, context, [
            ''
        ], {
            scriptable: false,
            indexable: false,
            allKeys: true
        });
    }

    function getIndexAxis(type, options) {
        const datasetDefaults = defaults.datasets[type] || {};
        const datasetOptions = (options.datasets || {})[type] || {};
        return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || 'x';
    }
    function getAxisFromDefaultScaleID(id, indexAxis) {
        let axis = id;
        if (id === '_index_') {
            axis = indexAxis;
        } else if (id === '_value_') {
            axis = indexAxis === 'x' ? 'y' : 'x';
        }
        return axis;
    }
    function getDefaultScaleIDFromAxis(axis, indexAxis) {
        return axis === indexAxis ? '_index_' : '_value_';
    }
    function idMatchesAxis(id) {
        if (id === 'x' || id === 'y' || id === 'r') {
            return id;
        }
    }
    function axisFromPosition(position) {
        if (position === 'top' || position === 'bottom') {
            return 'x';
        }
        if (position === 'left' || position === 'right') {
            return 'y';
        }
    }
    function determineAxis(id, ...scaleOptions) {
        if (idMatchesAxis(id)) {
            return id;
        }
        for (const opts of scaleOptions){
            const axis = opts.axis || axisFromPosition(opts.position) || id.length > 1 && idMatchesAxis(id[0].toLowerCase());
            if (axis) {
                return axis;
            }
        }
        throw new Error(`Cannot determine type of '${id}' axis. Please provide 'axis' or 'position' option.`);
    }
    function getAxisFromDataset(id, axis, dataset) {
        if (dataset[axis + 'AxisID'] === id) {
            return {
                axis
            };
        }
    }
    function retrieveAxisFromDatasets(id, config) {
        if (config.data && config.data.datasets) {
            const boundDs = config.data.datasets.filter((d)=>d.xAxisID === id || d.yAxisID === id);
            if (boundDs.length) {
                return getAxisFromDataset(id, 'x', boundDs[0]) || getAxisFromDataset(id, 'y', boundDs[0]);
            }
        }
        return {};
    }
    function mergeScaleConfig(config, options) {
        const chartDefaults = overrides[config.type] || {
            scales: {}
        };
        const configScales = options.scales || {};
        const chartIndexAxis = getIndexAxis(config.type, options);
        const scales = Object.create(null);
        Object.keys(configScales).forEach((id)=>{
            const scaleConf = configScales[id];
            if (!isObject(scaleConf)) {
                return console.error(`Invalid scale configuration for scale: ${id}`);
            }
            if (scaleConf._proxy) {
                return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
            }
            const axis = determineAxis(id, scaleConf, retrieveAxisFromDatasets(id, config), defaults.scales[scaleConf.type]);
            const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
            const defaultScaleOptions = chartDefaults.scales || {};
            scales[id] = mergeIf(Object.create(null), [
                {
                    axis
                },
                scaleConf,
                defaultScaleOptions[axis],
                defaultScaleOptions[defaultId]
            ]);
        });
        config.data.datasets.forEach((dataset)=>{
            const type = dataset.type || config.type;
            const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
            const datasetDefaults = overrides[type] || {};
            const defaultScaleOptions = datasetDefaults.scales || {};
            Object.keys(defaultScaleOptions).forEach((defaultID)=>{
                const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
                const id = dataset[axis + 'AxisID'] || axis;
                scales[id] = scales[id] || Object.create(null);
                mergeIf(scales[id], [
                    {
                        axis
                    },
                    configScales[id],
                    defaultScaleOptions[defaultID]
                ]);
            });
        });
        Object.keys(scales).forEach((key)=>{
            const scale = scales[key];
            mergeIf(scale, [
                defaults.scales[scale.type],
                defaults.scale
            ]);
        });
        return scales;
    }
    function initOptions(config) {
        const options = config.options || (config.options = {});
        options.plugins = valueOrDefault(options.plugins, {});
        options.scales = mergeScaleConfig(config, options);
    }
    function initData(data) {
        data = data || {};
        data.datasets = data.datasets || [];
        data.labels = data.labels || [];
        return data;
    }
    function initConfig(config) {
        config = config || {};
        config.data = initData(config.data);
        initOptions(config);
        return config;
    }
    const keyCache = new Map();
    const keysCached = new Set();
    function cachedKeys(cacheKey, generate) {
        let keys = keyCache.get(cacheKey);
        if (!keys) {
            keys = generate();
            keyCache.set(cacheKey, keys);
            keysCached.add(keys);
        }
        return keys;
    }
    const addIfFound = (set, obj, key)=>{
        const opts = resolveObjectKey(obj, key);
        if (opts !== undefined) {
            set.add(opts);
        }
    };
    class Config {
        constructor(config){
            this._config = initConfig(config);
            this._scopeCache = new Map();
            this._resolverCache = new Map();
        }
        get platform() {
            return this._config.platform;
        }
        get type() {
            return this._config.type;
        }
        set type(type) {
            this._config.type = type;
        }
        get data() {
            return this._config.data;
        }
        set data(data) {
            this._config.data = initData(data);
        }
        get options() {
            return this._config.options;
        }
        set options(options) {
            this._config.options = options;
        }
        get plugins() {
            return this._config.plugins;
        }
        update() {
            const config = this._config;
            this.clearCache();
            initOptions(config);
        }
        clearCache() {
            this._scopeCache.clear();
            this._resolverCache.clear();
        }
     datasetScopeKeys(datasetType) {
            return cachedKeys(datasetType, ()=>[
                    [
                        `datasets.${datasetType}`,
                        ''
                    ]
                ]);
        }
     datasetAnimationScopeKeys(datasetType, transition) {
            return cachedKeys(`${datasetType}.transition.${transition}`, ()=>[
                    [
                        `datasets.${datasetType}.transitions.${transition}`,
                        `transitions.${transition}`
                    ],
                    [
                        `datasets.${datasetType}`,
                        ''
                    ]
                ]);
        }
     datasetElementScopeKeys(datasetType, elementType) {
            return cachedKeys(`${datasetType}-${elementType}`, ()=>[
                    [
                        `datasets.${datasetType}.elements.${elementType}`,
                        `datasets.${datasetType}`,
                        `elements.${elementType}`,
                        ''
                    ]
                ]);
        }
     pluginScopeKeys(plugin) {
            const id = plugin.id;
            const type = this.type;
            return cachedKeys(`${type}-plugin-${id}`, ()=>[
                    [
                        `plugins.${id}`,
                        ...plugin.additionalOptionScopes || []
                    ]
                ]);
        }
     _cachedScopes(mainScope, resetCache) {
            const _scopeCache = this._scopeCache;
            let cache = _scopeCache.get(mainScope);
            if (!cache || resetCache) {
                cache = new Map();
                _scopeCache.set(mainScope, cache);
            }
            return cache;
        }
     getOptionScopes(mainScope, keyLists, resetCache) {
            const { options , type  } = this;
            const cache = this._cachedScopes(mainScope, resetCache);
            const cached = cache.get(keyLists);
            if (cached) {
                return cached;
            }
            const scopes = new Set();
            keyLists.forEach((keys)=>{
                if (mainScope) {
                    scopes.add(mainScope);
                    keys.forEach((key)=>addIfFound(scopes, mainScope, key));
                }
                keys.forEach((key)=>addIfFound(scopes, options, key));
                keys.forEach((key)=>addIfFound(scopes, overrides[type] || {}, key));
                keys.forEach((key)=>addIfFound(scopes, defaults, key));
                keys.forEach((key)=>addIfFound(scopes, descriptors, key));
            });
            const array = Array.from(scopes);
            if (array.length === 0) {
                array.push(Object.create(null));
            }
            if (keysCached.has(keyLists)) {
                cache.set(keyLists, array);
            }
            return array;
        }
     chartOptionScopes() {
            const { options , type  } = this;
            return [
                options,
                overrides[type] || {},
                defaults.datasets[type] || {},
                {
                    type
                },
                defaults,
                descriptors
            ];
        }
     resolveNamedOptions(scopes, names, context, prefixes = [
            ''
        ]) {
            const result = {
                $shared: true
            };
            const { resolver , subPrefixes  } = getResolver(this._resolverCache, scopes, prefixes);
            let options = resolver;
            if (needContext(resolver, names)) {
                result.$shared = false;
                context = isFunction(context) ? context() : context;
                const subResolver = this.createResolver(scopes, context, subPrefixes);
                options = _attachContext(resolver, context, subResolver);
            }
            for (const prop of names){
                result[prop] = options[prop];
            }
            return result;
        }
     createResolver(scopes, context, prefixes = [
            ''
        ], descriptorDefaults) {
            const { resolver  } = getResolver(this._resolverCache, scopes, prefixes);
            return isObject(context) ? _attachContext(resolver, context, undefined, descriptorDefaults) : resolver;
        }
    }
    function getResolver(resolverCache, scopes, prefixes) {
        let cache = resolverCache.get(scopes);
        if (!cache) {
            cache = new Map();
            resolverCache.set(scopes, cache);
        }
        const cacheKey = prefixes.join();
        let cached = cache.get(cacheKey);
        if (!cached) {
            const resolver = _createResolver(scopes, prefixes);
            cached = {
                resolver,
                subPrefixes: prefixes.filter((p)=>!p.toLowerCase().includes('hover'))
            };
            cache.set(cacheKey, cached);
        }
        return cached;
    }
    const hasFunction = (value)=>isObject(value) && Object.getOwnPropertyNames(value).some((key)=>isFunction(value[key]));
    function needContext(proxy, names) {
        const { isScriptable , isIndexable  } = _descriptors(proxy);
        for (const prop of names){
            const scriptable = isScriptable(prop);
            const indexable = isIndexable(prop);
            const value = (indexable || scriptable) && proxy[prop];
            if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
                return true;
            }
        }
        return false;
    }

    var version = "4.4.2";

    const KNOWN_POSITIONS = [
        'top',
        'bottom',
        'left',
        'right',
        'chartArea'
    ];
    function positionIsHorizontal(position, axis) {
        return position === 'top' || position === 'bottom' || KNOWN_POSITIONS.indexOf(position) === -1 && axis === 'x';
    }
    function compare2Level(l1, l2) {
        return function(a, b) {
            return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
        };
    }
    function onAnimationsComplete(context) {
        const chart = context.chart;
        const animationOptions = chart.options.animation;
        chart.notifyPlugins('afterRender');
        callback(animationOptions && animationOptions.onComplete, [
            context
        ], chart);
    }
    function onAnimationProgress(context) {
        const chart = context.chart;
        const animationOptions = chart.options.animation;
        callback(animationOptions && animationOptions.onProgress, [
            context
        ], chart);
    }
     function getCanvas(item) {
        if (_isDomSupported() && typeof item === 'string') {
            item = document.getElementById(item);
        } else if (item && item.length) {
            item = item[0];
        }
        if (item && item.canvas) {
            item = item.canvas;
        }
        return item;
    }
    const instances = {};
    const getChart = (key)=>{
        const canvas = getCanvas(key);
        return Object.values(instances).filter((c)=>c.canvas === canvas).pop();
    };
    function moveNumericKeys(obj, start, move) {
        const keys = Object.keys(obj);
        for (const key of keys){
            const intKey = +key;
            if (intKey >= start) {
                const value = obj[key];
                delete obj[key];
                if (move > 0 || intKey > start) {
                    obj[intKey + move] = value;
                }
            }
        }
    }
     function determineLastEvent(e, lastEvent, inChartArea, isClick) {
        if (!inChartArea || e.type === 'mouseout') {
            return null;
        }
        if (isClick) {
            return lastEvent;
        }
        return e;
    }
    function getSizeForArea(scale, chartArea, field) {
        return scale.options.clip ? scale[field] : chartArea[field];
    }
    function getDatasetArea(meta, chartArea) {
        const { xScale , yScale  } = meta;
        if (xScale && yScale) {
            return {
                left: getSizeForArea(xScale, chartArea, 'left'),
                right: getSizeForArea(xScale, chartArea, 'right'),
                top: getSizeForArea(yScale, chartArea, 'top'),
                bottom: getSizeForArea(yScale, chartArea, 'bottom')
            };
        }
        return chartArea;
    }
    class Chart {
        static defaults = defaults;
        static instances = instances;
        static overrides = overrides;
        static registry = registry;
        static version = version;
        static getChart = getChart;
        static register(...items) {
            registry.add(...items);
            invalidatePlugins();
        }
        static unregister(...items) {
            registry.remove(...items);
            invalidatePlugins();
        }
        constructor(item, userConfig){
            const config = this.config = new Config(userConfig);
            const initialCanvas = getCanvas(item);
            const existingChart = getChart(initialCanvas);
            if (existingChart) {
                throw new Error('Canvas is already in use. Chart with ID \'' + existingChart.id + '\'' + ' must be destroyed before the canvas with ID \'' + existingChart.canvas.id + '\' can be reused.');
            }
            const options = config.createResolver(config.chartOptionScopes(), this.getContext());
            this.platform = new (config.platform || _detectPlatform(initialCanvas))();
            this.platform.updateConfig(config);
            const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
            const canvas = context && context.canvas;
            const height = canvas && canvas.height;
            const width = canvas && canvas.width;
            this.id = uid();
            this.ctx = context;
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this._options = options;
            this._aspectRatio = this.aspectRatio;
            this._layers = [];
            this._metasets = [];
            this._stacks = undefined;
            this.boxes = [];
            this.currentDevicePixelRatio = undefined;
            this.chartArea = undefined;
            this._active = [];
            this._lastEvent = undefined;
            this._listeners = {};
             this._responsiveListeners = undefined;
            this._sortedMetasets = [];
            this.scales = {};
            this._plugins = new PluginService();
            this.$proxies = {};
            this._hiddenIndices = {};
            this.attached = false;
            this._animationsDisabled = undefined;
            this.$context = undefined;
            this._doResize = debounce((mode)=>this.update(mode), options.resizeDelay || 0);
            this._dataChanges = [];
            instances[this.id] = this;
            if (!context || !canvas) {
                console.error("Failed to create chart: can't acquire context from the given item");
                return;
            }
            animator.listen(this, 'complete', onAnimationsComplete);
            animator.listen(this, 'progress', onAnimationProgress);
            this._initialize();
            if (this.attached) {
                this.update();
            }
        }
        get aspectRatio() {
            const { options: { aspectRatio , maintainAspectRatio  } , width , height , _aspectRatio  } = this;
            if (!isNullOrUndef(aspectRatio)) {
                return aspectRatio;
            }
            if (maintainAspectRatio && _aspectRatio) {
                return _aspectRatio;
            }
            return height ? width / height : null;
        }
        get data() {
            return this.config.data;
        }
        set data(data) {
            this.config.data = data;
        }
        get options() {
            return this._options;
        }
        set options(options) {
            this.config.options = options;
        }
        get registry() {
            return registry;
        }
     _initialize() {
            this.notifyPlugins('beforeInit');
            if (this.options.responsive) {
                this.resize();
            } else {
                retinaScale(this, this.options.devicePixelRatio);
            }
            this.bindEvents();
            this.notifyPlugins('afterInit');
            return this;
        }
        clear() {
            clearCanvas(this.canvas, this.ctx);
            return this;
        }
        stop() {
            animator.stop(this);
            return this;
        }
     resize(width, height) {
            if (!animator.running(this)) {
                this._resize(width, height);
            } else {
                this._resizeBeforeDraw = {
                    width,
                    height
                };
            }
        }
        _resize(width, height) {
            const options = this.options;
            const canvas = this.canvas;
            const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
            const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
            const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
            const mode = this.width ? 'resize' : 'attach';
            this.width = newSize.width;
            this.height = newSize.height;
            this._aspectRatio = this.aspectRatio;
            if (!retinaScale(this, newRatio, true)) {
                return;
            }
            this.notifyPlugins('resize', {
                size: newSize
            });
            callback(options.onResize, [
                this,
                newSize
            ], this);
            if (this.attached) {
                if (this._doResize(mode)) {
                    this.render();
                }
            }
        }
        ensureScalesHaveIDs() {
            const options = this.options;
            const scalesOptions = options.scales || {};
            each(scalesOptions, (axisOptions, axisID)=>{
                axisOptions.id = axisID;
            });
        }
     buildOrUpdateScales() {
            const options = this.options;
            const scaleOpts = options.scales;
            const scales = this.scales;
            const updated = Object.keys(scales).reduce((obj, id)=>{
                obj[id] = false;
                return obj;
            }, {});
            let items = [];
            if (scaleOpts) {
                items = items.concat(Object.keys(scaleOpts).map((id)=>{
                    const scaleOptions = scaleOpts[id];
                    const axis = determineAxis(id, scaleOptions);
                    const isRadial = axis === 'r';
                    const isHorizontal = axis === 'x';
                    return {
                        options: scaleOptions,
                        dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
                        dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
                    };
                }));
            }
            each(items, (item)=>{
                const scaleOptions = item.options;
                const id = scaleOptions.id;
                const axis = determineAxis(id, scaleOptions);
                const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
                if (scaleOptions.position === undefined || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
                    scaleOptions.position = item.dposition;
                }
                updated[id] = true;
                let scale = null;
                if (id in scales && scales[id].type === scaleType) {
                    scale = scales[id];
                } else {
                    const scaleClass = registry.getScale(scaleType);
                    scale = new scaleClass({
                        id,
                        type: scaleType,
                        ctx: this.ctx,
                        chart: this
                    });
                    scales[scale.id] = scale;
                }
                scale.init(scaleOptions, options);
            });
            each(updated, (hasUpdated, id)=>{
                if (!hasUpdated) {
                    delete scales[id];
                }
            });
            each(scales, (scale)=>{
                layouts.configure(this, scale, scale.options);
                layouts.addBox(this, scale);
            });
        }
     _updateMetasets() {
            const metasets = this._metasets;
            const numData = this.data.datasets.length;
            const numMeta = metasets.length;
            metasets.sort((a, b)=>a.index - b.index);
            if (numMeta > numData) {
                for(let i = numData; i < numMeta; ++i){
                    this._destroyDatasetMeta(i);
                }
                metasets.splice(numData, numMeta - numData);
            }
            this._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'index'));
        }
     _removeUnreferencedMetasets() {
            const { _metasets: metasets , data: { datasets  }  } = this;
            if (metasets.length > datasets.length) {
                delete this._stacks;
            }
            metasets.forEach((meta, index)=>{
                if (datasets.filter((x)=>x === meta._dataset).length === 0) {
                    this._destroyDatasetMeta(index);
                }
            });
        }
        buildOrUpdateControllers() {
            const newControllers = [];
            const datasets = this.data.datasets;
            let i, ilen;
            this._removeUnreferencedMetasets();
            for(i = 0, ilen = datasets.length; i < ilen; i++){
                const dataset = datasets[i];
                let meta = this.getDatasetMeta(i);
                const type = dataset.type || this.config.type;
                if (meta.type && meta.type !== type) {
                    this._destroyDatasetMeta(i);
                    meta = this.getDatasetMeta(i);
                }
                meta.type = type;
                meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
                meta.order = dataset.order || 0;
                meta.index = i;
                meta.label = '' + dataset.label;
                meta.visible = this.isDatasetVisible(i);
                if (meta.controller) {
                    meta.controller.updateIndex(i);
                    meta.controller.linkScales();
                } else {
                    const ControllerClass = registry.getController(type);
                    const { datasetElementType , dataElementType  } = defaults.datasets[type];
                    Object.assign(ControllerClass, {
                        dataElementType: registry.getElement(dataElementType),
                        datasetElementType: datasetElementType && registry.getElement(datasetElementType)
                    });
                    meta.controller = new ControllerClass(this, i);
                    newControllers.push(meta.controller);
                }
            }
            this._updateMetasets();
            return newControllers;
        }
     _resetElements() {
            each(this.data.datasets, (dataset, datasetIndex)=>{
                this.getDatasetMeta(datasetIndex).controller.reset();
            }, this);
        }
     reset() {
            this._resetElements();
            this.notifyPlugins('reset');
        }
        update(mode) {
            const config = this.config;
            config.update();
            const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
            const animsDisabled = this._animationsDisabled = !options.animation;
            this._updateScales();
            this._checkEventBindings();
            this._updateHiddenIndices();
            this._plugins.invalidate();
            if (this.notifyPlugins('beforeUpdate', {
                mode,
                cancelable: true
            }) === false) {
                return;
            }
            const newControllers = this.buildOrUpdateControllers();
            this.notifyPlugins('beforeElementsUpdate');
            let minPadding = 0;
            for(let i = 0, ilen = this.data.datasets.length; i < ilen; i++){
                const { controller  } = this.getDatasetMeta(i);
                const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
                controller.buildOrUpdateElements(reset);
                minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
            }
            minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
            this._updateLayout(minPadding);
            if (!animsDisabled) {
                each(newControllers, (controller)=>{
                    controller.reset();
                });
            }
            this._updateDatasets(mode);
            this.notifyPlugins('afterUpdate', {
                mode
            });
            this._layers.sort(compare2Level('z', '_idx'));
            const { _active , _lastEvent  } = this;
            if (_lastEvent) {
                this._eventHandler(_lastEvent, true);
            } else if (_active.length) {
                this._updateHoverStyles(_active, _active, true);
            }
            this.render();
        }
     _updateScales() {
            each(this.scales, (scale)=>{
                layouts.removeBox(this, scale);
            });
            this.ensureScalesHaveIDs();
            this.buildOrUpdateScales();
        }
     _checkEventBindings() {
            const options = this.options;
            const existingEvents = new Set(Object.keys(this._listeners));
            const newEvents = new Set(options.events);
            if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
                this.unbindEvents();
                this.bindEvents();
            }
        }
     _updateHiddenIndices() {
            const { _hiddenIndices  } = this;
            const changes = this._getUniformDataChanges() || [];
            for (const { method , start , count  } of changes){
                const move = method === '_removeElements' ? -count : count;
                moveNumericKeys(_hiddenIndices, start, move);
            }
        }
     _getUniformDataChanges() {
            const _dataChanges = this._dataChanges;
            if (!_dataChanges || !_dataChanges.length) {
                return;
            }
            this._dataChanges = [];
            const datasetCount = this.data.datasets.length;
            const makeSet = (idx)=>new Set(_dataChanges.filter((c)=>c[0] === idx).map((c, i)=>i + ',' + c.splice(1).join(',')));
            const changeSet = makeSet(0);
            for(let i = 1; i < datasetCount; i++){
                if (!setsEqual(changeSet, makeSet(i))) {
                    return;
                }
            }
            return Array.from(changeSet).map((c)=>c.split(',')).map((a)=>({
                    method: a[1],
                    start: +a[2],
                    count: +a[3]
                }));
        }
     _updateLayout(minPadding) {
            if (this.notifyPlugins('beforeLayout', {
                cancelable: true
            }) === false) {
                return;
            }
            layouts.update(this, this.width, this.height, minPadding);
            const area = this.chartArea;
            const noArea = area.width <= 0 || area.height <= 0;
            this._layers = [];
            each(this.boxes, (box)=>{
                if (noArea && box.position === 'chartArea') {
                    return;
                }
                if (box.configure) {
                    box.configure();
                }
                this._layers.push(...box._layers());
            }, this);
            this._layers.forEach((item, index)=>{
                item._idx = index;
            });
            this.notifyPlugins('afterLayout');
        }
     _updateDatasets(mode) {
            if (this.notifyPlugins('beforeDatasetsUpdate', {
                mode,
                cancelable: true
            }) === false) {
                return;
            }
            for(let i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
                this.getDatasetMeta(i).controller.configure();
            }
            for(let i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
                this._updateDataset(i, isFunction(mode) ? mode({
                    datasetIndex: i
                }) : mode);
            }
            this.notifyPlugins('afterDatasetsUpdate', {
                mode
            });
        }
     _updateDataset(index, mode) {
            const meta = this.getDatasetMeta(index);
            const args = {
                meta,
                index,
                mode,
                cancelable: true
            };
            if (this.notifyPlugins('beforeDatasetUpdate', args) === false) {
                return;
            }
            meta.controller._update(mode);
            args.cancelable = false;
            this.notifyPlugins('afterDatasetUpdate', args);
        }
        render() {
            if (this.notifyPlugins('beforeRender', {
                cancelable: true
            }) === false) {
                return;
            }
            if (animator.has(this)) {
                if (this.attached && !animator.running(this)) {
                    animator.start(this);
                }
            } else {
                this.draw();
                onAnimationsComplete({
                    chart: this
                });
            }
        }
        draw() {
            let i;
            if (this._resizeBeforeDraw) {
                const { width , height  } = this._resizeBeforeDraw;
                this._resize(width, height);
                this._resizeBeforeDraw = null;
            }
            this.clear();
            if (this.width <= 0 || this.height <= 0) {
                return;
            }
            if (this.notifyPlugins('beforeDraw', {
                cancelable: true
            }) === false) {
                return;
            }
            const layers = this._layers;
            for(i = 0; i < layers.length && layers[i].z <= 0; ++i){
                layers[i].draw(this.chartArea);
            }
            this._drawDatasets();
            for(; i < layers.length; ++i){
                layers[i].draw(this.chartArea);
            }
            this.notifyPlugins('afterDraw');
        }
     _getSortedDatasetMetas(filterVisible) {
            const metasets = this._sortedMetasets;
            const result = [];
            let i, ilen;
            for(i = 0, ilen = metasets.length; i < ilen; ++i){
                const meta = metasets[i];
                if (!filterVisible || meta.visible) {
                    result.push(meta);
                }
            }
            return result;
        }
     getSortedVisibleDatasetMetas() {
            return this._getSortedDatasetMetas(true);
        }
     _drawDatasets() {
            if (this.notifyPlugins('beforeDatasetsDraw', {
                cancelable: true
            }) === false) {
                return;
            }
            const metasets = this.getSortedVisibleDatasetMetas();
            for(let i = metasets.length - 1; i >= 0; --i){
                this._drawDataset(metasets[i]);
            }
            this.notifyPlugins('afterDatasetsDraw');
        }
     _drawDataset(meta) {
            const ctx = this.ctx;
            const clip = meta._clip;
            const useClip = !clip.disabled;
            const area = getDatasetArea(meta, this.chartArea);
            const args = {
                meta,
                index: meta.index,
                cancelable: true
            };
            if (this.notifyPlugins('beforeDatasetDraw', args) === false) {
                return;
            }
            if (useClip) {
                clipArea(ctx, {
                    left: clip.left === false ? 0 : area.left - clip.left,
                    right: clip.right === false ? this.width : area.right + clip.right,
                    top: clip.top === false ? 0 : area.top - clip.top,
                    bottom: clip.bottom === false ? this.height : area.bottom + clip.bottom
                });
            }
            meta.controller.draw();
            if (useClip) {
                unclipArea(ctx);
            }
            args.cancelable = false;
            this.notifyPlugins('afterDatasetDraw', args);
        }
     isPointInArea(point) {
            return _isPointInArea(point, this.chartArea, this._minPadding);
        }
        getElementsAtEventForMode(e, mode, options, useFinalPosition) {
            const method = Interaction.modes[mode];
            if (typeof method === 'function') {
                return method(this, e, options, useFinalPosition);
            }
            return [];
        }
        getDatasetMeta(datasetIndex) {
            const dataset = this.data.datasets[datasetIndex];
            const metasets = this._metasets;
            let meta = metasets.filter((x)=>x && x._dataset === dataset).pop();
            if (!meta) {
                meta = {
                    type: null,
                    data: [],
                    dataset: null,
                    controller: null,
                    hidden: null,
                    xAxisID: null,
                    yAxisID: null,
                    order: dataset && dataset.order || 0,
                    index: datasetIndex,
                    _dataset: dataset,
                    _parsed: [],
                    _sorted: false
                };
                metasets.push(meta);
            }
            return meta;
        }
        getContext() {
            return this.$context || (this.$context = createContext(null, {
                chart: this,
                type: 'chart'
            }));
        }
        getVisibleDatasetCount() {
            return this.getSortedVisibleDatasetMetas().length;
        }
        isDatasetVisible(datasetIndex) {
            const dataset = this.data.datasets[datasetIndex];
            if (!dataset) {
                return false;
            }
            const meta = this.getDatasetMeta(datasetIndex);
            return typeof meta.hidden === 'boolean' ? !meta.hidden : !dataset.hidden;
        }
        setDatasetVisibility(datasetIndex, visible) {
            const meta = this.getDatasetMeta(datasetIndex);
            meta.hidden = !visible;
        }
        toggleDataVisibility(index) {
            this._hiddenIndices[index] = !this._hiddenIndices[index];
        }
        getDataVisibility(index) {
            return !this._hiddenIndices[index];
        }
     _updateVisibility(datasetIndex, dataIndex, visible) {
            const mode = visible ? 'show' : 'hide';
            const meta = this.getDatasetMeta(datasetIndex);
            const anims = meta.controller._resolveAnimations(undefined, mode);
            if (defined(dataIndex)) {
                meta.data[dataIndex].hidden = !visible;
                this.update();
            } else {
                this.setDatasetVisibility(datasetIndex, visible);
                anims.update(meta, {
                    visible
                });
                this.update((ctx)=>ctx.datasetIndex === datasetIndex ? mode : undefined);
            }
        }
        hide(datasetIndex, dataIndex) {
            this._updateVisibility(datasetIndex, dataIndex, false);
        }
        show(datasetIndex, dataIndex) {
            this._updateVisibility(datasetIndex, dataIndex, true);
        }
     _destroyDatasetMeta(datasetIndex) {
            const meta = this._metasets[datasetIndex];
            if (meta && meta.controller) {
                meta.controller._destroy();
            }
            delete this._metasets[datasetIndex];
        }
        _stop() {
            let i, ilen;
            this.stop();
            animator.remove(this);
            for(i = 0, ilen = this.data.datasets.length; i < ilen; ++i){
                this._destroyDatasetMeta(i);
            }
        }
        destroy() {
            this.notifyPlugins('beforeDestroy');
            const { canvas , ctx  } = this;
            this._stop();
            this.config.clearCache();
            if (canvas) {
                this.unbindEvents();
                clearCanvas(canvas, ctx);
                this.platform.releaseContext(ctx);
                this.canvas = null;
                this.ctx = null;
            }
            delete instances[this.id];
            this.notifyPlugins('afterDestroy');
        }
        toBase64Image(...args) {
            return this.canvas.toDataURL(...args);
        }
     bindEvents() {
            this.bindUserEvents();
            if (this.options.responsive) {
                this.bindResponsiveEvents();
            } else {
                this.attached = true;
            }
        }
     bindUserEvents() {
            const listeners = this._listeners;
            const platform = this.platform;
            const _add = (type, listener)=>{
                platform.addEventListener(this, type, listener);
                listeners[type] = listener;
            };
            const listener = (e, x, y)=>{
                e.offsetX = x;
                e.offsetY = y;
                this._eventHandler(e);
            };
            each(this.options.events, (type)=>_add(type, listener));
        }
     bindResponsiveEvents() {
            if (!this._responsiveListeners) {
                this._responsiveListeners = {};
            }
            const listeners = this._responsiveListeners;
            const platform = this.platform;
            const _add = (type, listener)=>{
                platform.addEventListener(this, type, listener);
                listeners[type] = listener;
            };
            const _remove = (type, listener)=>{
                if (listeners[type]) {
                    platform.removeEventListener(this, type, listener);
                    delete listeners[type];
                }
            };
            const listener = (width, height)=>{
                if (this.canvas) {
                    this.resize(width, height);
                }
            };
            let detached;
            const attached = ()=>{
                _remove('attach', attached);
                this.attached = true;
                this.resize();
                _add('resize', listener);
                _add('detach', detached);
            };
            detached = ()=>{
                this.attached = false;
                _remove('resize', listener);
                this._stop();
                this._resize(0, 0);
                _add('attach', attached);
            };
            if (platform.isAttached(this.canvas)) {
                attached();
            } else {
                detached();
            }
        }
     unbindEvents() {
            each(this._listeners, (listener, type)=>{
                this.platform.removeEventListener(this, type, listener);
            });
            this._listeners = {};
            each(this._responsiveListeners, (listener, type)=>{
                this.platform.removeEventListener(this, type, listener);
            });
            this._responsiveListeners = undefined;
        }
        updateHoverStyle(items, mode, enabled) {
            const prefix = enabled ? 'set' : 'remove';
            let meta, item, i, ilen;
            if (mode === 'dataset') {
                meta = this.getDatasetMeta(items[0].datasetIndex);
                meta.controller['_' + prefix + 'DatasetHoverStyle']();
            }
            for(i = 0, ilen = items.length; i < ilen; ++i){
                item = items[i];
                const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
                if (controller) {
                    controller[prefix + 'HoverStyle'](item.element, item.datasetIndex, item.index);
                }
            }
        }
     getActiveElements() {
            return this._active || [];
        }
     setActiveElements(activeElements) {
            const lastActive = this._active || [];
            const active = activeElements.map(({ datasetIndex , index  })=>{
                const meta = this.getDatasetMeta(datasetIndex);
                if (!meta) {
                    throw new Error('No dataset found at index ' + datasetIndex);
                }
                return {
                    datasetIndex,
                    element: meta.data[index],
                    index
                };
            });
            const changed = !_elementsEqual(active, lastActive);
            if (changed) {
                this._active = active;
                this._lastEvent = null;
                this._updateHoverStyles(active, lastActive);
            }
        }
     notifyPlugins(hook, args, filter) {
            return this._plugins.notify(this, hook, args, filter);
        }
     isPluginEnabled(pluginId) {
            return this._plugins._cache.filter((p)=>p.plugin.id === pluginId).length === 1;
        }
     _updateHoverStyles(active, lastActive, replay) {
            const hoverOptions = this.options.hover;
            const diff = (a, b)=>a.filter((x)=>!b.some((y)=>x.datasetIndex === y.datasetIndex && x.index === y.index));
            const deactivated = diff(lastActive, active);
            const activated = replay ? active : diff(active, lastActive);
            if (deactivated.length) {
                this.updateHoverStyle(deactivated, hoverOptions.mode, false);
            }
            if (activated.length && hoverOptions.mode) {
                this.updateHoverStyle(activated, hoverOptions.mode, true);
            }
        }
     _eventHandler(e, replay) {
            const args = {
                event: e,
                replay,
                cancelable: true,
                inChartArea: this.isPointInArea(e)
            };
            const eventFilter = (plugin)=>(plugin.options.events || this.options.events).includes(e.native.type);
            if (this.notifyPlugins('beforeEvent', args, eventFilter) === false) {
                return;
            }
            const changed = this._handleEvent(e, replay, args.inChartArea);
            args.cancelable = false;
            this.notifyPlugins('afterEvent', args, eventFilter);
            if (changed || args.changed) {
                this.render();
            }
            return this;
        }
     _handleEvent(e, replay, inChartArea) {
            const { _active: lastActive = [] , options  } = this;
            const useFinalPosition = replay;
            const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
            const isClick = _isClickEvent(e);
            const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
            if (inChartArea) {
                this._lastEvent = null;
                callback(options.onHover, [
                    e,
                    active,
                    this
                ], this);
                if (isClick) {
                    callback(options.onClick, [
                        e,
                        active,
                        this
                    ], this);
                }
            }
            const changed = !_elementsEqual(active, lastActive);
            if (changed || replay) {
                this._active = active;
                this._updateHoverStyles(active, lastActive, replay);
            }
            this._lastEvent = lastEvent;
            return changed;
        }
     _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
            if (e.type === 'mouseout') {
                return [];
            }
            if (!inChartArea) {
                return lastActive;
            }
            const hoverOptions = this.options.hover;
            return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
        }
    }
    function invalidatePlugins() {
        return each(Chart.instances, (chart)=>chart._plugins.invalidate());
    }

    function clipArc(ctx, element, endAngle) {
        const { startAngle , pixelMargin , x , y , outerRadius , innerRadius  } = element;
        let angleMargin = pixelMargin / outerRadius;
        // Draw an inner border by clipping the arc and drawing a double-width border
        // Enlarge the clipping arc by 0.33 pixels to eliminate glitches between borders
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
        if (innerRadius > pixelMargin) {
            angleMargin = pixelMargin / innerRadius;
            ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
        } else {
            ctx.arc(x, y, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
        }
        ctx.closePath();
        ctx.clip();
    }
    function toRadiusCorners(value) {
        return _readValueToProps(value, [
            'outerStart',
            'outerEnd',
            'innerStart',
            'innerEnd'
        ]);
    }
    /**
     * Parse border radius from the provided options
     */ function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
        const o = toRadiusCorners(arc.options.borderRadius);
        const halfThickness = (outerRadius - innerRadius) / 2;
        const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
        // Outer limits are complicated. We want to compute the available angular distance at
        // a radius of outerRadius - borderRadius because for small angular distances, this term limits.
        // We compute at r = outerRadius - borderRadius because this circle defines the center of the border corners.
        //
        // If the borderRadius is large, that value can become negative.
        // This causes the outer borders to lose their radius entirely, which is rather unexpected. To solve that, if borderRadius > outerRadius
        // we know that the thickness term will dominate and compute the limits at that point
        const computeOuterLimit = (val)=>{
            const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
            return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
        };
        return {
            outerStart: computeOuterLimit(o.outerStart),
            outerEnd: computeOuterLimit(o.outerEnd),
            innerStart: _limitValue(o.innerStart, 0, innerLimit),
            innerEnd: _limitValue(o.innerEnd, 0, innerLimit)
        };
    }
    /**
     * Convert (r, 𝜃) to (x, y)
     */ function rThetaToXY(r, theta, x, y) {
        return {
            x: x + r * Math.cos(theta),
            y: y + r * Math.sin(theta)
        };
    }
    /**
     * Path the arc, respecting border radius by separating into left and right halves.
     *
     *   Start      End
     *
     *    1--->a--->2    Outer
     *   /           \
     *   8           3
     *   |           |
     *   |           |
     *   7           4
     *   \           /
     *    6<---b<---5    Inner
     */ function pathArc(ctx, element, offset, spacing, end, circular) {
        const { x , y , startAngle: start , pixelMargin , innerRadius: innerR  } = element;
        const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
        const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
        let spacingOffset = 0;
        const alpha = end - start;
        if (spacing) {
            // When spacing is present, it is the same for all items
            // So we adjust the start and end angle of the arc such that
            // the distance is the same as it would be without the spacing
            const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
            const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
            const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
            const adjustedAngle = avNogSpacingRadius !== 0 ? alpha * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha;
            spacingOffset = (alpha - adjustedAngle) / 2;
        }
        const beta = Math.max(0.001, alpha * outerRadius - offset / PI) / outerRadius;
        const angleOffset = (alpha - beta) / 2;
        const startAngle = start + angleOffset + spacingOffset;
        const endAngle = end - angleOffset - spacingOffset;
        const { outerStart , outerEnd , innerStart , innerEnd  } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
        const outerStartAdjustedRadius = outerRadius - outerStart;
        const outerEndAdjustedRadius = outerRadius - outerEnd;
        const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
        const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
        const innerStartAdjustedRadius = innerRadius + innerStart;
        const innerEndAdjustedRadius = innerRadius + innerEnd;
        const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
        const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
        ctx.beginPath();
        if (circular) {
            // The first arc segments from point 1 to point a to point 2
            const outerMidAdjustedAngle = (outerStartAdjustedAngle + outerEndAdjustedAngle) / 2;
            ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerMidAdjustedAngle);
            ctx.arc(x, y, outerRadius, outerMidAdjustedAngle, outerEndAdjustedAngle);
            // The corner segment from point 2 to point 3
            if (outerEnd > 0) {
                const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
                ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
            }
            // The line from point 3 to point 4
            const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
            ctx.lineTo(p4.x, p4.y);
            // The corner segment from point 4 to point 5
            if (innerEnd > 0) {
                const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
                ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
            }
            // The inner arc from point 5 to point b to point 6
            const innerMidAdjustedAngle = (endAngle - innerEnd / innerRadius + (startAngle + innerStart / innerRadius)) / 2;
            ctx.arc(x, y, innerRadius, endAngle - innerEnd / innerRadius, innerMidAdjustedAngle, true);
            ctx.arc(x, y, innerRadius, innerMidAdjustedAngle, startAngle + innerStart / innerRadius, true);
            // The corner segment from point 6 to point 7
            if (innerStart > 0) {
                const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
                ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
            }
            // The line from point 7 to point 8
            const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
            ctx.lineTo(p8.x, p8.y);
            // The corner segment from point 8 to point 1
            if (outerStart > 0) {
                const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
                ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
            }
        } else {
            ctx.moveTo(x, y);
            const outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + x;
            const outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y;
            ctx.lineTo(outerStartX, outerStartY);
            const outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + x;
            const outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y;
            ctx.lineTo(outerEndX, outerEndY);
        }
        ctx.closePath();
    }
    function drawArc(ctx, element, offset, spacing, circular) {
        const { fullCircles , startAngle , circumference  } = element;
        let endAngle = element.endAngle;
        if (fullCircles) {
            pathArc(ctx, element, offset, spacing, endAngle, circular);
            for(let i = 0; i < fullCircles; ++i){
                ctx.fill();
            }
            if (!isNaN(circumference)) {
                endAngle = startAngle + (circumference % TAU || TAU);
            }
        }
        pathArc(ctx, element, offset, spacing, endAngle, circular);
        ctx.fill();
        return endAngle;
    }
    function drawBorder(ctx, element, offset, spacing, circular) {
        const { fullCircles , startAngle , circumference , options  } = element;
        const { borderWidth , borderJoinStyle , borderDash , borderDashOffset  } = options;
        const inner = options.borderAlign === 'inner';
        if (!borderWidth) {
            return;
        }
        ctx.setLineDash(borderDash || []);
        ctx.lineDashOffset = borderDashOffset;
        if (inner) {
            ctx.lineWidth = borderWidth * 2;
            ctx.lineJoin = borderJoinStyle || 'round';
        } else {
            ctx.lineWidth = borderWidth;
            ctx.lineJoin = borderJoinStyle || 'bevel';
        }
        let endAngle = element.endAngle;
        if (fullCircles) {
            pathArc(ctx, element, offset, spacing, endAngle, circular);
            for(let i = 0; i < fullCircles; ++i){
                ctx.stroke();
            }
            if (!isNaN(circumference)) {
                endAngle = startAngle + (circumference % TAU || TAU);
            }
        }
        if (inner) {
            clipArc(ctx, element, endAngle);
        }
        if (!fullCircles) {
            pathArc(ctx, element, offset, spacing, endAngle, circular);
            ctx.stroke();
        }
    }
    class ArcElement extends Element {
        static id = 'arc';
        static defaults = {
            borderAlign: 'center',
            borderColor: '#fff',
            borderDash: [],
            borderDashOffset: 0,
            borderJoinStyle: undefined,
            borderRadius: 0,
            borderWidth: 2,
            offset: 0,
            spacing: 0,
            angle: undefined,
            circular: true
        };
        static defaultRoutes = {
            backgroundColor: 'backgroundColor'
        };
        static descriptors = {
            _scriptable: true,
            _indexable: (name)=>name !== 'borderDash'
        };
        circumference;
        endAngle;
        fullCircles;
        innerRadius;
        outerRadius;
        pixelMargin;
        startAngle;
        constructor(cfg){
            super();
            this.options = undefined;
            this.circumference = undefined;
            this.startAngle = undefined;
            this.endAngle = undefined;
            this.innerRadius = undefined;
            this.outerRadius = undefined;
            this.pixelMargin = 0;
            this.fullCircles = 0;
            if (cfg) {
                Object.assign(this, cfg);
            }
        }
        inRange(chartX, chartY, useFinalPosition) {
            const point = this.getProps([
                'x',
                'y'
            ], useFinalPosition);
            const { angle , distance  } = getAngleFromPoint(point, {
                x: chartX,
                y: chartY
            });
            const { startAngle , endAngle , innerRadius , outerRadius , circumference  } = this.getProps([
                'startAngle',
                'endAngle',
                'innerRadius',
                'outerRadius',
                'circumference'
            ], useFinalPosition);
            const rAdjust = (this.options.spacing + this.options.borderWidth) / 2;
            const _circumference = valueOrDefault(circumference, endAngle - startAngle);
            const betweenAngles = _circumference >= TAU || _angleBetween(angle, startAngle, endAngle);
            const withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
            return betweenAngles && withinRadius;
        }
        getCenterPoint(useFinalPosition) {
            const { x , y , startAngle , endAngle , innerRadius , outerRadius  } = this.getProps([
                'x',
                'y',
                'startAngle',
                'endAngle',
                'innerRadius',
                'outerRadius'
            ], useFinalPosition);
            const { offset , spacing  } = this.options;
            const halfAngle = (startAngle + endAngle) / 2;
            const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
            return {
                x: x + Math.cos(halfAngle) * halfRadius,
                y: y + Math.sin(halfAngle) * halfRadius
            };
        }
        tooltipPosition(useFinalPosition) {
            return this.getCenterPoint(useFinalPosition);
        }
        draw(ctx) {
            const { options , circumference  } = this;
            const offset = (options.offset || 0) / 4;
            const spacing = (options.spacing || 0) / 2;
            const circular = options.circular;
            this.pixelMargin = options.borderAlign === 'inner' ? 0.33 : 0;
            this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
            if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
                return;
            }
            ctx.save();
            const halfAngle = (this.startAngle + this.endAngle) / 2;
            ctx.translate(Math.cos(halfAngle) * offset, Math.sin(halfAngle) * offset);
            const fix = 1 - Math.sin(Math.min(PI, circumference || 0));
            const radiusOffset = offset * fix;
            ctx.fillStyle = options.backgroundColor;
            ctx.strokeStyle = options.borderColor;
            drawArc(ctx, this, radiusOffset, spacing, circular);
            drawBorder(ctx, this, radiusOffset, spacing, circular);
            ctx.restore();
        }
    }

    function setStyle(ctx, options, style = options) {
        ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
        ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
        ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
        ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
        ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
        ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
    }
    function lineTo(ctx, previous, target) {
        ctx.lineTo(target.x, target.y);
    }
     function getLineMethod(options) {
        if (options.stepped) {
            return _steppedLineTo;
        }
        if (options.tension || options.cubicInterpolationMode === 'monotone') {
            return _bezierCurveTo;
        }
        return lineTo;
    }
    function pathVars(points, segment, params = {}) {
        const count = points.length;
        const { start: paramsStart = 0 , end: paramsEnd = count - 1  } = params;
        const { start: segmentStart , end: segmentEnd  } = segment;
        const start = Math.max(paramsStart, segmentStart);
        const end = Math.min(paramsEnd, segmentEnd);
        const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
        return {
            count,
            start,
            loop: segment.loop,
            ilen: end < start && !outside ? count + end - start : end - start
        };
    }
     function pathSegment(ctx, line, segment, params) {
        const { points , options  } = line;
        const { count , start , loop , ilen  } = pathVars(points, segment, params);
        const lineMethod = getLineMethod(options);
        let { move =true , reverse  } = params || {};
        let i, point, prev;
        for(i = 0; i <= ilen; ++i){
            point = points[(start + (reverse ? ilen - i : i)) % count];
            if (point.skip) {
                continue;
            } else if (move) {
                ctx.moveTo(point.x, point.y);
                move = false;
            } else {
                lineMethod(ctx, prev, point, reverse, options.stepped);
            }
            prev = point;
        }
        if (loop) {
            point = points[(start + (reverse ? ilen : 0)) % count];
            lineMethod(ctx, prev, point, reverse, options.stepped);
        }
        return !!loop;
    }
     function fastPathSegment(ctx, line, segment, params) {
        const points = line.points;
        const { count , start , ilen  } = pathVars(points, segment, params);
        const { move =true , reverse  } = params || {};
        let avgX = 0;
        let countX = 0;
        let i, point, prevX, minY, maxY, lastY;
        const pointIndex = (index)=>(start + (reverse ? ilen - index : index)) % count;
        const drawX = ()=>{
            if (minY !== maxY) {
                ctx.lineTo(avgX, maxY);
                ctx.lineTo(avgX, minY);
                ctx.lineTo(avgX, lastY);
            }
        };
        if (move) {
            point = points[pointIndex(0)];
            ctx.moveTo(point.x, point.y);
        }
        for(i = 0; i <= ilen; ++i){
            point = points[pointIndex(i)];
            if (point.skip) {
                continue;
            }
            const x = point.x;
            const y = point.y;
            const truncX = x | 0;
            if (truncX === prevX) {
                if (y < minY) {
                    minY = y;
                } else if (y > maxY) {
                    maxY = y;
                }
                avgX = (countX * avgX + x) / ++countX;
            } else {
                drawX();
                ctx.lineTo(x, y);
                prevX = truncX;
                countX = 0;
                minY = maxY = y;
            }
            lastY = y;
        }
        drawX();
    }
     function _getSegmentMethod(line) {
        const opts = line.options;
        const borderDash = opts.borderDash && opts.borderDash.length;
        const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== 'monotone' && !opts.stepped && !borderDash;
        return useFastPath ? fastPathSegment : pathSegment;
    }
     function _getInterpolationMethod(options) {
        if (options.stepped) {
            return _steppedInterpolation;
        }
        if (options.tension || options.cubicInterpolationMode === 'monotone') {
            return _bezierInterpolation;
        }
        return _pointInLine;
    }
    function strokePathWithCache(ctx, line, start, count) {
        let path = line._path;
        if (!path) {
            path = line._path = new Path2D();
            if (line.path(path, start, count)) {
                path.closePath();
            }
        }
        setStyle(ctx, line.options);
        ctx.stroke(path);
    }
    function strokePathDirect(ctx, line, start, count) {
        const { segments , options  } = line;
        const segmentMethod = _getSegmentMethod(line);
        for (const segment of segments){
            setStyle(ctx, options, segment.style);
            ctx.beginPath();
            if (segmentMethod(ctx, line, segment, {
                start,
                end: start + count - 1
            })) {
                ctx.closePath();
            }
            ctx.stroke();
        }
    }
    const usePath2D = typeof Path2D === 'function';
    function draw(ctx, line, start, count) {
        if (usePath2D && !line.options.segment) {
            strokePathWithCache(ctx, line, start, count);
        } else {
            strokePathDirect(ctx, line, start, count);
        }
    }
    class LineElement extends Element {
        static id = 'line';
     static defaults = {
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0,
            borderJoinStyle: 'miter',
            borderWidth: 3,
            capBezierPoints: true,
            cubicInterpolationMode: 'default',
            fill: false,
            spanGaps: false,
            stepped: false,
            tension: 0
        };
     static defaultRoutes = {
            backgroundColor: 'backgroundColor',
            borderColor: 'borderColor'
        };
        static descriptors = {
            _scriptable: true,
            _indexable: (name)=>name !== 'borderDash' && name !== 'fill'
        };
        constructor(cfg){
            super();
            this.animated = true;
            this.options = undefined;
            this._chart = undefined;
            this._loop = undefined;
            this._fullLoop = undefined;
            this._path = undefined;
            this._points = undefined;
            this._segments = undefined;
            this._decimated = false;
            this._pointsUpdated = false;
            this._datasetIndex = undefined;
            if (cfg) {
                Object.assign(this, cfg);
            }
        }
        updateControlPoints(chartArea, indexAxis) {
            const options = this.options;
            if ((options.tension || options.cubicInterpolationMode === 'monotone') && !options.stepped && !this._pointsUpdated) {
                const loop = options.spanGaps ? this._loop : this._fullLoop;
                _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
                this._pointsUpdated = true;
            }
        }
        set points(points) {
            this._points = points;
            delete this._segments;
            delete this._path;
            this._pointsUpdated = false;
        }
        get points() {
            return this._points;
        }
        get segments() {
            return this._segments || (this._segments = _computeSegments(this, this.options.segment));
        }
     first() {
            const segments = this.segments;
            const points = this.points;
            return segments.length && points[segments[0].start];
        }
     last() {
            const segments = this.segments;
            const points = this.points;
            const count = segments.length;
            return count && points[segments[count - 1].end];
        }
     interpolate(point, property) {
            const options = this.options;
            const value = point[property];
            const points = this.points;
            const segments = _boundSegments(this, {
                property,
                start: value,
                end: value
            });
            if (!segments.length) {
                return;
            }
            const result = [];
            const _interpolate = _getInterpolationMethod(options);
            let i, ilen;
            for(i = 0, ilen = segments.length; i < ilen; ++i){
                const { start , end  } = segments[i];
                const p1 = points[start];
                const p2 = points[end];
                if (p1 === p2) {
                    result.push(p1);
                    continue;
                }
                const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
                const interpolated = _interpolate(p1, p2, t, options.stepped);
                interpolated[property] = point[property];
                result.push(interpolated);
            }
            return result.length === 1 ? result[0] : result;
        }
     pathSegment(ctx, segment, params) {
            const segmentMethod = _getSegmentMethod(this);
            return segmentMethod(ctx, this, segment, params);
        }
     path(ctx, start, count) {
            const segments = this.segments;
            const segmentMethod = _getSegmentMethod(this);
            let loop = this._loop;
            start = start || 0;
            count = count || this.points.length - start;
            for (const segment of segments){
                loop &= segmentMethod(ctx, this, segment, {
                    start,
                    end: start + count - 1
                });
            }
            return !!loop;
        }
     draw(ctx, chartArea, start, count) {
            const options = this.options || {};
            const points = this.points || [];
            if (points.length && options.borderWidth) {
                ctx.save();
                draw(ctx, this, start, count);
                ctx.restore();
            }
            if (this.animated) {
                this._pointsUpdated = false;
                this._path = undefined;
            }
        }
    }

    function inRange$1(el, pos, axis, useFinalPosition) {
        const options = el.options;
        const { [axis]: value  } = el.getProps([
            axis
        ], useFinalPosition);
        return Math.abs(pos - value) < options.radius + options.hitRadius;
    }
    class PointElement extends Element {
        static id = 'point';
        parsed;
        skip;
        stop;
        /**
       * @type {any}
       */ static defaults = {
            borderWidth: 1,
            hitRadius: 1,
            hoverBorderWidth: 1,
            hoverRadius: 4,
            pointStyle: 'circle',
            radius: 3,
            rotation: 0
        };
        /**
       * @type {any}
       */ static defaultRoutes = {
            backgroundColor: 'backgroundColor',
            borderColor: 'borderColor'
        };
        constructor(cfg){
            super();
            this.options = undefined;
            this.parsed = undefined;
            this.skip = undefined;
            this.stop = undefined;
            if (cfg) {
                Object.assign(this, cfg);
            }
        }
        inRange(mouseX, mouseY, useFinalPosition) {
            const options = this.options;
            const { x , y  } = this.getProps([
                'x',
                'y'
            ], useFinalPosition);
            return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
        }
        inXRange(mouseX, useFinalPosition) {
            return inRange$1(this, mouseX, 'x', useFinalPosition);
        }
        inYRange(mouseY, useFinalPosition) {
            return inRange$1(this, mouseY, 'y', useFinalPosition);
        }
        getCenterPoint(useFinalPosition) {
            const { x , y  } = this.getProps([
                'x',
                'y'
            ], useFinalPosition);
            return {
                x,
                y
            };
        }
        size(options) {
            options = options || this.options || {};
            let radius = options.radius || 0;
            radius = Math.max(radius, radius && options.hoverRadius || 0);
            const borderWidth = radius && options.borderWidth || 0;
            return (radius + borderWidth) * 2;
        }
        draw(ctx, area) {
            const options = this.options;
            if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
                return;
            }
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            ctx.fillStyle = options.backgroundColor;
            drawPoint(ctx, options, this.x, this.y);
        }
        getRange() {
            const options = this.options || {};
            // @ts-expect-error Fallbacks should never be hit in practice
            return options.radius + options.hitRadius;
        }
    }

    function getBarBounds(bar, useFinalPosition) {
        const { x , y , base , width , height  } =  bar.getProps([
            'x',
            'y',
            'base',
            'width',
            'height'
        ], useFinalPosition);
        let left, right, top, bottom, half;
        if (bar.horizontal) {
            half = height / 2;
            left = Math.min(x, base);
            right = Math.max(x, base);
            top = y - half;
            bottom = y + half;
        } else {
            half = width / 2;
            left = x - half;
            right = x + half;
            top = Math.min(y, base);
            bottom = Math.max(y, base);
        }
        return {
            left,
            top,
            right,
            bottom
        };
    }
    function skipOrLimit(skip, value, min, max) {
        return skip ? 0 : _limitValue(value, min, max);
    }
    function parseBorderWidth(bar, maxW, maxH) {
        const value = bar.options.borderWidth;
        const skip = bar.borderSkipped;
        const o = toTRBL(value);
        return {
            t: skipOrLimit(skip.top, o.top, 0, maxH),
            r: skipOrLimit(skip.right, o.right, 0, maxW),
            b: skipOrLimit(skip.bottom, o.bottom, 0, maxH),
            l: skipOrLimit(skip.left, o.left, 0, maxW)
        };
    }
    function parseBorderRadius(bar, maxW, maxH) {
        const { enableBorderRadius  } = bar.getProps([
            'enableBorderRadius'
        ]);
        const value = bar.options.borderRadius;
        const o = toTRBLCorners(value);
        const maxR = Math.min(maxW, maxH);
        const skip = bar.borderSkipped;
        const enableBorder = enableBorderRadius || isObject(value);
        return {
            topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o.topLeft, 0, maxR),
            topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o.topRight, 0, maxR),
            bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o.bottomLeft, 0, maxR),
            bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o.bottomRight, 0, maxR)
        };
    }
    function boundingRects(bar) {
        const bounds = getBarBounds(bar);
        const width = bounds.right - bounds.left;
        const height = bounds.bottom - bounds.top;
        const border = parseBorderWidth(bar, width / 2, height / 2);
        const radius = parseBorderRadius(bar, width / 2, height / 2);
        return {
            outer: {
                x: bounds.left,
                y: bounds.top,
                w: width,
                h: height,
                radius
            },
            inner: {
                x: bounds.left + border.l,
                y: bounds.top + border.t,
                w: width - border.l - border.r,
                h: height - border.t - border.b,
                radius: {
                    topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
                    topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
                    bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
                    bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
                }
            }
        };
    }
    function inRange(bar, x, y, useFinalPosition) {
        const skipX = x === null;
        const skipY = y === null;
        const skipBoth = skipX && skipY;
        const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
        return bounds && (skipX || _isBetween(x, bounds.left, bounds.right)) && (skipY || _isBetween(y, bounds.top, bounds.bottom));
    }
    function hasRadius(radius) {
        return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
    }
     function addNormalRectPath(ctx, rect) {
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
    }
    function inflateRect(rect, amount, refRect = {}) {
        const x = rect.x !== refRect.x ? -amount : 0;
        const y = rect.y !== refRect.y ? -amount : 0;
        const w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x;
        const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
        return {
            x: rect.x + x,
            y: rect.y + y,
            w: rect.w + w,
            h: rect.h + h,
            radius: rect.radius
        };
    }
    class BarElement extends Element {
        static id = 'bar';
     static defaults = {
            borderSkipped: 'start',
            borderWidth: 0,
            borderRadius: 0,
            inflateAmount: 'auto',
            pointStyle: undefined
        };
     static defaultRoutes = {
            backgroundColor: 'backgroundColor',
            borderColor: 'borderColor'
        };
        constructor(cfg){
            super();
            this.options = undefined;
            this.horizontal = undefined;
            this.base = undefined;
            this.width = undefined;
            this.height = undefined;
            this.inflateAmount = undefined;
            if (cfg) {
                Object.assign(this, cfg);
            }
        }
        draw(ctx) {
            const { inflateAmount , options: { borderColor , backgroundColor  }  } = this;
            const { inner , outer  } = boundingRects(this);
            const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
            ctx.save();
            if (outer.w !== inner.w || outer.h !== inner.h) {
                ctx.beginPath();
                addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
                ctx.clip();
                addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
                ctx.fillStyle = borderColor;
                ctx.fill('evenodd');
            }
            ctx.beginPath();
            addRectPath(ctx, inflateRect(inner, inflateAmount));
            ctx.fillStyle = backgroundColor;
            ctx.fill();
            ctx.restore();
        }
        inRange(mouseX, mouseY, useFinalPosition) {
            return inRange(this, mouseX, mouseY, useFinalPosition);
        }
        inXRange(mouseX, useFinalPosition) {
            return inRange(this, mouseX, null, useFinalPosition);
        }
        inYRange(mouseY, useFinalPosition) {
            return inRange(this, null, mouseY, useFinalPosition);
        }
        getCenterPoint(useFinalPosition) {
            const { x , y , base , horizontal  } =  this.getProps([
                'x',
                'y',
                'base',
                'horizontal'
            ], useFinalPosition);
            return {
                x: horizontal ? (x + base) / 2 : x,
                y: horizontal ? y : (y + base) / 2
            };
        }
        getRange(axis) {
            return axis === 'x' ? this.width / 2 : this.height / 2;
        }
    }

    var elements = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ArcElement: ArcElement,
    BarElement: BarElement,
    LineElement: LineElement,
    PointElement: PointElement
    });

    const BORDER_COLORS = [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)' // grey
    ];
    // Border colors with 50% transparency
    const BACKGROUND_COLORS = /* #__PURE__ */ BORDER_COLORS.map((color)=>color.replace('rgb(', 'rgba(').replace(')', ', 0.5)'));
    function getBorderColor(i) {
        return BORDER_COLORS[i % BORDER_COLORS.length];
    }
    function getBackgroundColor(i) {
        return BACKGROUND_COLORS[i % BACKGROUND_COLORS.length];
    }
    function colorizeDefaultDataset(dataset, i) {
        dataset.borderColor = getBorderColor(i);
        dataset.backgroundColor = getBackgroundColor(i);
        return ++i;
    }
    function colorizeDoughnutDataset(dataset, i) {
        dataset.backgroundColor = dataset.data.map(()=>getBorderColor(i++));
        return i;
    }
    function colorizePolarAreaDataset(dataset, i) {
        dataset.backgroundColor = dataset.data.map(()=>getBackgroundColor(i++));
        return i;
    }
    function getColorizer(chart) {
        let i = 0;
        return (dataset, datasetIndex)=>{
            const controller = chart.getDatasetMeta(datasetIndex).controller;
            if (controller instanceof DoughnutController) {
                i = colorizeDoughnutDataset(dataset, i);
            } else if (controller instanceof PolarAreaController) {
                i = colorizePolarAreaDataset(dataset, i);
            } else if (controller) {
                i = colorizeDefaultDataset(dataset, i);
            }
        };
    }
    function containsColorsDefinitions(descriptors) {
        let k;
        for(k in descriptors){
            if (descriptors[k].borderColor || descriptors[k].backgroundColor) {
                return true;
            }
        }
        return false;
    }
    function containsColorsDefinition(descriptor) {
        return descriptor && (descriptor.borderColor || descriptor.backgroundColor);
    }
    var plugin_colors = {
        id: 'colors',
        defaults: {
            enabled: true,
            forceOverride: false
        },
        beforeLayout (chart, _args, options) {
            if (!options.enabled) {
                return;
            }
            const { data: { datasets  } , options: chartOptions  } = chart.config;
            const { elements  } = chartOptions;
            if (!options.forceOverride && (containsColorsDefinitions(datasets) || containsColorsDefinition(chartOptions) || elements && containsColorsDefinitions(elements))) {
                return;
            }
            const colorizer = getColorizer(chart);
            datasets.forEach(colorizer);
        }
    };

    function lttbDecimation(data, start, count, availableWidth, options) {
     const samples = options.samples || availableWidth;
        if (samples >= count) {
            return data.slice(start, start + count);
        }
        const decimated = [];
        const bucketWidth = (count - 2) / (samples - 2);
        let sampledIndex = 0;
        const endIndex = start + count - 1;
        let a = start;
        let i, maxAreaPoint, maxArea, area, nextA;
        decimated[sampledIndex++] = data[a];
        for(i = 0; i < samples - 2; i++){
            let avgX = 0;
            let avgY = 0;
            let j;
            const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
            const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
            const avgRangeLength = avgRangeEnd - avgRangeStart;
            for(j = avgRangeStart; j < avgRangeEnd; j++){
                avgX += data[j].x;
                avgY += data[j].y;
            }
            avgX /= avgRangeLength;
            avgY /= avgRangeLength;
            const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
            const rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start;
            const { x: pointAx , y: pointAy  } = data[a];
            maxArea = area = -1;
            for(j = rangeOffs; j < rangeTo; j++){
                area = 0.5 * Math.abs((pointAx - avgX) * (data[j].y - pointAy) - (pointAx - data[j].x) * (avgY - pointAy));
                if (area > maxArea) {
                    maxArea = area;
                    maxAreaPoint = data[j];
                    nextA = j;
                }
            }
            decimated[sampledIndex++] = maxAreaPoint;
            a = nextA;
        }
        decimated[sampledIndex++] = data[endIndex];
        return decimated;
    }
    function minMaxDecimation(data, start, count, availableWidth) {
        let avgX = 0;
        let countX = 0;
        let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY;
        const decimated = [];
        const endIndex = start + count - 1;
        const xMin = data[start].x;
        const xMax = data[endIndex].x;
        const dx = xMax - xMin;
        for(i = start; i < start + count; ++i){
            point = data[i];
            x = (point.x - xMin) / dx * availableWidth;
            y = point.y;
            const truncX = x | 0;
            if (truncX === prevX) {
                if (y < minY) {
                    minY = y;
                    minIndex = i;
                } else if (y > maxY) {
                    maxY = y;
                    maxIndex = i;
                }
                avgX = (countX * avgX + point.x) / ++countX;
            } else {
                const lastIndex = i - 1;
                if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
                    const intermediateIndex1 = Math.min(minIndex, maxIndex);
                    const intermediateIndex2 = Math.max(minIndex, maxIndex);
                    if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
                        decimated.push({
                            ...data[intermediateIndex1],
                            x: avgX
                        });
                    }
                    if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
                        decimated.push({
                            ...data[intermediateIndex2],
                            x: avgX
                        });
                    }
                }
                if (i > 0 && lastIndex !== startIndex) {
                    decimated.push(data[lastIndex]);
                }
                decimated.push(point);
                prevX = truncX;
                countX = 0;
                minY = maxY = y;
                minIndex = maxIndex = startIndex = i;
            }
        }
        return decimated;
    }
    function cleanDecimatedDataset(dataset) {
        if (dataset._decimated) {
            const data = dataset._data;
            delete dataset._decimated;
            delete dataset._data;
            Object.defineProperty(dataset, 'data', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: data
            });
        }
    }
    function cleanDecimatedData(chart) {
        chart.data.datasets.forEach((dataset)=>{
            cleanDecimatedDataset(dataset);
        });
    }
    function getStartAndCountOfVisiblePointsSimplified(meta, points) {
        const pointCount = points.length;
        let start = 0;
        let count;
        const { iScale  } = meta;
        const { min , max , minDefined , maxDefined  } = iScale.getUserBounds();
        if (minDefined) {
            start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
        }
        if (maxDefined) {
            count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
        } else {
            count = pointCount - start;
        }
        return {
            start,
            count
        };
    }
    var plugin_decimation = {
        id: 'decimation',
        defaults: {
            algorithm: 'min-max',
            enabled: false
        },
        beforeElementsUpdate: (chart, args, options)=>{
            if (!options.enabled) {
                cleanDecimatedData(chart);
                return;
            }
            const availableWidth = chart.width;
            chart.data.datasets.forEach((dataset, datasetIndex)=>{
                const { _data , indexAxis  } = dataset;
                const meta = chart.getDatasetMeta(datasetIndex);
                const data = _data || dataset.data;
                if (resolve([
                    indexAxis,
                    chart.options.indexAxis
                ]) === 'y') {
                    return;
                }
                if (!meta.controller.supportsDecimation) {
                    return;
                }
                const xAxis = chart.scales[meta.xAxisID];
                if (xAxis.type !== 'linear' && xAxis.type !== 'time') {
                    return;
                }
                if (chart.options.parsing) {
                    return;
                }
                let { start , count  } = getStartAndCountOfVisiblePointsSimplified(meta, data);
                const threshold = options.threshold || 4 * availableWidth;
                if (count <= threshold) {
                    cleanDecimatedDataset(dataset);
                    return;
                }
                if (isNullOrUndef(_data)) {
                    dataset._data = data;
                    delete dataset.data;
                    Object.defineProperty(dataset, 'data', {
                        configurable: true,
                        enumerable: true,
                        get: function() {
                            return this._decimated;
                        },
                        set: function(d) {
                            this._data = d;
                        }
                    });
                }
                let decimated;
                switch(options.algorithm){
                    case 'lttb':
                        decimated = lttbDecimation(data, start, count, availableWidth, options);
                        break;
                    case 'min-max':
                        decimated = minMaxDecimation(data, start, count, availableWidth);
                        break;
                    default:
                        throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
                }
                dataset._decimated = decimated;
            });
        },
        destroy (chart) {
            cleanDecimatedData(chart);
        }
    };

    function _segments(line, target, property) {
        const segments = line.segments;
        const points = line.points;
        const tpoints = target.points;
        const parts = [];
        for (const segment of segments){
            let { start , end  } = segment;
            end = _findSegmentEnd(start, end, points);
            const bounds = _getBounds(property, points[start], points[end], segment.loop);
            if (!target.segments) {
                parts.push({
                    source: segment,
                    target: bounds,
                    start: points[start],
                    end: points[end]
                });
                continue;
            }
            const targetSegments = _boundSegments(target, bounds);
            for (const tgt of targetSegments){
                const subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
                const fillSources = _boundSegment(segment, points, subBounds);
                for (const fillSource of fillSources){
                    parts.push({
                        source: fillSource,
                        target: tgt,
                        start: {
                            [property]: _getEdge(bounds, subBounds, 'start', Math.max)
                        },
                        end: {
                            [property]: _getEdge(bounds, subBounds, 'end', Math.min)
                        }
                    });
                }
            }
        }
        return parts;
    }
    function _getBounds(property, first, last, loop) {
        if (loop) {
            return;
        }
        let start = first[property];
        let end = last[property];
        if (property === 'angle') {
            start = _normalizeAngle(start);
            end = _normalizeAngle(end);
        }
        return {
            property,
            start,
            end
        };
    }
    function _pointsFromSegments(boundary, line) {
        const { x =null , y =null  } = boundary || {};
        const linePoints = line.points;
        const points = [];
        line.segments.forEach(({ start , end  })=>{
            end = _findSegmentEnd(start, end, linePoints);
            const first = linePoints[start];
            const last = linePoints[end];
            if (y !== null) {
                points.push({
                    x: first.x,
                    y
                });
                points.push({
                    x: last.x,
                    y
                });
            } else if (x !== null) {
                points.push({
                    x,
                    y: first.y
                });
                points.push({
                    x,
                    y: last.y
                });
            }
        });
        return points;
    }
    function _findSegmentEnd(start, end, points) {
        for(; end > start; end--){
            const point = points[end];
            if (!isNaN(point.x) && !isNaN(point.y)) {
                break;
            }
        }
        return end;
    }
    function _getEdge(a, b, prop, fn) {
        if (a && b) {
            return fn(a[prop], b[prop]);
        }
        return a ? a[prop] : b ? b[prop] : 0;
    }

    function _createBoundaryLine(boundary, line) {
        let points = [];
        let _loop = false;
        if (isArray(boundary)) {
            _loop = true;
            points = boundary;
        } else {
            points = _pointsFromSegments(boundary, line);
        }
        return points.length ? new LineElement({
            points,
            options: {
                tension: 0
            },
            _loop,
            _fullLoop: _loop
        }) : null;
    }
    function _shouldApplyFill(source) {
        return source && source.fill !== false;
    }

    function _resolveTarget(sources, index, propagate) {
        const source = sources[index];
        let fill = source.fill;
        const visited = [
            index
        ];
        let target;
        if (!propagate) {
            return fill;
        }
        while(fill !== false && visited.indexOf(fill) === -1){
            if (!isNumberFinite(fill)) {
                return fill;
            }
            target = sources[fill];
            if (!target) {
                return false;
            }
            if (target.visible) {
                return fill;
            }
            visited.push(fill);
            fill = target.fill;
        }
        return false;
    }
     function _decodeFill(line, index, count) {
         const fill = parseFillOption(line);
        if (isObject(fill)) {
            return isNaN(fill.value) ? false : fill;
        }
        let target = parseFloat(fill);
        if (isNumberFinite(target) && Math.floor(target) === target) {
            return decodeTargetIndex(fill[0], index, target, count);
        }
        return [
            'origin',
            'start',
            'end',
            'stack',
            'shape'
        ].indexOf(fill) >= 0 && fill;
    }
    function decodeTargetIndex(firstCh, index, target, count) {
        if (firstCh === '-' || firstCh === '+') {
            target = index + target;
        }
        if (target === index || target < 0 || target >= count) {
            return false;
        }
        return target;
    }
     function _getTargetPixel(fill, scale) {
        let pixel = null;
        if (fill === 'start') {
            pixel = scale.bottom;
        } else if (fill === 'end') {
            pixel = scale.top;
        } else if (isObject(fill)) {
            pixel = scale.getPixelForValue(fill.value);
        } else if (scale.getBasePixel) {
            pixel = scale.getBasePixel();
        }
        return pixel;
    }
     function _getTargetValue(fill, scale, startValue) {
        let value;
        if (fill === 'start') {
            value = startValue;
        } else if (fill === 'end') {
            value = scale.options.reverse ? scale.min : scale.max;
        } else if (isObject(fill)) {
            value = fill.value;
        } else {
            value = scale.getBaseValue();
        }
        return value;
    }
     function parseFillOption(line) {
        const options = line.options;
        const fillOption = options.fill;
        let fill = valueOrDefault(fillOption && fillOption.target, fillOption);
        if (fill === undefined) {
            fill = !!options.backgroundColor;
        }
        if (fill === false || fill === null) {
            return false;
        }
        if (fill === true) {
            return 'origin';
        }
        return fill;
    }

    function _buildStackLine(source) {
        const { scale , index , line  } = source;
        const points = [];
        const segments = line.segments;
        const sourcePoints = line.points;
        const linesBelow = getLinesBelow(scale, index);
        linesBelow.push(_createBoundaryLine({
            x: null,
            y: scale.bottom
        }, line));
        for(let i = 0; i < segments.length; i++){
            const segment = segments[i];
            for(let j = segment.start; j <= segment.end; j++){
                addPointsBelow(points, sourcePoints[j], linesBelow);
            }
        }
        return new LineElement({
            points,
            options: {}
        });
    }
     function getLinesBelow(scale, index) {
        const below = [];
        const metas = scale.getMatchingVisibleMetas('line');
        for(let i = 0; i < metas.length; i++){
            const meta = metas[i];
            if (meta.index === index) {
                break;
            }
            if (!meta.hidden) {
                below.unshift(meta.dataset);
            }
        }
        return below;
    }
     function addPointsBelow(points, sourcePoint, linesBelow) {
        const postponed = [];
        for(let j = 0; j < linesBelow.length; j++){
            const line = linesBelow[j];
            const { first , last , point  } = findPoint(line, sourcePoint, 'x');
            if (!point || first && last) {
                continue;
            }
            if (first) {
                postponed.unshift(point);
            } else {
                points.push(point);
                if (!last) {
                    break;
                }
            }
        }
        points.push(...postponed);
    }
     function findPoint(line, sourcePoint, property) {
        const point = line.interpolate(sourcePoint, property);
        if (!point) {
            return {};
        }
        const pointValue = point[property];
        const segments = line.segments;
        const linePoints = line.points;
        let first = false;
        let last = false;
        for(let i = 0; i < segments.length; i++){
            const segment = segments[i];
            const firstValue = linePoints[segment.start][property];
            const lastValue = linePoints[segment.end][property];
            if (_isBetween(pointValue, firstValue, lastValue)) {
                first = pointValue === firstValue;
                last = pointValue === lastValue;
                break;
            }
        }
        return {
            first,
            last,
            point
        };
    }

    class simpleArc {
        constructor(opts){
            this.x = opts.x;
            this.y = opts.y;
            this.radius = opts.radius;
        }
        pathSegment(ctx, bounds, opts) {
            const { x , y , radius  } = this;
            bounds = bounds || {
                start: 0,
                end: TAU
            };
            ctx.arc(x, y, radius, bounds.end, bounds.start, true);
            return !opts.bounds;
        }
        interpolate(point) {
            const { x , y , radius  } = this;
            const angle = point.angle;
            return {
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius,
                angle
            };
        }
    }

    function _getTarget(source) {
        const { chart , fill , line  } = source;
        if (isNumberFinite(fill)) {
            return getLineByIndex(chart, fill);
        }
        if (fill === 'stack') {
            return _buildStackLine(source);
        }
        if (fill === 'shape') {
            return true;
        }
        const boundary = computeBoundary(source);
        if (boundary instanceof simpleArc) {
            return boundary;
        }
        return _createBoundaryLine(boundary, line);
    }
     function getLineByIndex(chart, index) {
        const meta = chart.getDatasetMeta(index);
        const visible = meta && chart.isDatasetVisible(index);
        return visible ? meta.dataset : null;
    }
    function computeBoundary(source) {
        const scale = source.scale || {};
        if (scale.getPointPositionForValue) {
            return computeCircularBoundary(source);
        }
        return computeLinearBoundary(source);
    }
    function computeLinearBoundary(source) {
        const { scale ={} , fill  } = source;
        const pixel = _getTargetPixel(fill, scale);
        if (isNumberFinite(pixel)) {
            const horizontal = scale.isHorizontal();
            return {
                x: horizontal ? pixel : null,
                y: horizontal ? null : pixel
            };
        }
        return null;
    }
    function computeCircularBoundary(source) {
        const { scale , fill  } = source;
        const options = scale.options;
        const length = scale.getLabels().length;
        const start = options.reverse ? scale.max : scale.min;
        const value = _getTargetValue(fill, scale, start);
        const target = [];
        if (options.grid.circular) {
            const center = scale.getPointPositionForValue(0, start);
            return new simpleArc({
                x: center.x,
                y: center.y,
                radius: scale.getDistanceFromCenterForValue(value)
            });
        }
        for(let i = 0; i < length; ++i){
            target.push(scale.getPointPositionForValue(i, value));
        }
        return target;
    }

    function _drawfill(ctx, source, area) {
        const target = _getTarget(source);
        const { line , scale , axis  } = source;
        const lineOpts = line.options;
        const fillOption = lineOpts.fill;
        const color = lineOpts.backgroundColor;
        const { above =color , below =color  } = fillOption || {};
        if (target && line.points.length) {
            clipArea(ctx, area);
            doFill(ctx, {
                line,
                target,
                above,
                below,
                area,
                scale,
                axis
            });
            unclipArea(ctx);
        }
    }
    function doFill(ctx, cfg) {
        const { line , target , above , below , area , scale  } = cfg;
        const property = line._loop ? 'angle' : cfg.axis;
        ctx.save();
        if (property === 'x' && below !== above) {
            clipVertical(ctx, target, area.top);
            fill(ctx, {
                line,
                target,
                color: above,
                scale,
                property
            });
            ctx.restore();
            ctx.save();
            clipVertical(ctx, target, area.bottom);
        }
        fill(ctx, {
            line,
            target,
            color: below,
            scale,
            property
        });
        ctx.restore();
    }
    function clipVertical(ctx, target, clipY) {
        const { segments , points  } = target;
        let first = true;
        let lineLoop = false;
        ctx.beginPath();
        for (const segment of segments){
            const { start , end  } = segment;
            const firstPoint = points[start];
            const lastPoint = points[_findSegmentEnd(start, end, points)];
            if (first) {
                ctx.moveTo(firstPoint.x, firstPoint.y);
                first = false;
            } else {
                ctx.lineTo(firstPoint.x, clipY);
                ctx.lineTo(firstPoint.x, firstPoint.y);
            }
            lineLoop = !!target.pathSegment(ctx, segment, {
                move: lineLoop
            });
            if (lineLoop) {
                ctx.closePath();
            } else {
                ctx.lineTo(lastPoint.x, clipY);
            }
        }
        ctx.lineTo(target.first().x, clipY);
        ctx.closePath();
        ctx.clip();
    }
    function fill(ctx, cfg) {
        const { line , target , property , color , scale  } = cfg;
        const segments = _segments(line, target, property);
        for (const { source: src , target: tgt , start , end  } of segments){
            const { style: { backgroundColor =color  } = {}  } = src;
            const notShape = target !== true;
            ctx.save();
            ctx.fillStyle = backgroundColor;
            clipBounds(ctx, scale, notShape && _getBounds(property, start, end));
            ctx.beginPath();
            const lineLoop = !!line.pathSegment(ctx, src);
            let loop;
            if (notShape) {
                if (lineLoop) {
                    ctx.closePath();
                } else {
                    interpolatedLineTo(ctx, target, end, property);
                }
                const targetLoop = !!target.pathSegment(ctx, tgt, {
                    move: lineLoop,
                    reverse: true
                });
                loop = lineLoop && targetLoop;
                if (!loop) {
                    interpolatedLineTo(ctx, target, start, property);
                }
            }
            ctx.closePath();
            ctx.fill(loop ? 'evenodd' : 'nonzero');
            ctx.restore();
        }
    }
    function clipBounds(ctx, scale, bounds) {
        const { top , bottom  } = scale.chart.chartArea;
        const { property , start , end  } = bounds || {};
        if (property === 'x') {
            ctx.beginPath();
            ctx.rect(start, top, end - start, bottom - top);
            ctx.clip();
        }
    }
    function interpolatedLineTo(ctx, target, point, property) {
        const interpolatedPoint = target.interpolate(point, property);
        if (interpolatedPoint) {
            ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
        }
    }

    var index = {
        id: 'filler',
        afterDatasetsUpdate (chart, _args, options) {
            const count = (chart.data.datasets || []).length;
            const sources = [];
            let meta, i, line, source;
            for(i = 0; i < count; ++i){
                meta = chart.getDatasetMeta(i);
                line = meta.dataset;
                source = null;
                if (line && line.options && line instanceof LineElement) {
                    source = {
                        visible: chart.isDatasetVisible(i),
                        index: i,
                        fill: _decodeFill(line, i, count),
                        chart,
                        axis: meta.controller.options.indexAxis,
                        scale: meta.vScale,
                        line
                    };
                }
                meta.$filler = source;
                sources.push(source);
            }
            for(i = 0; i < count; ++i){
                source = sources[i];
                if (!source || source.fill === false) {
                    continue;
                }
                source.fill = _resolveTarget(sources, i, options.propagate);
            }
        },
        beforeDraw (chart, _args, options) {
            const draw = options.drawTime === 'beforeDraw';
            const metasets = chart.getSortedVisibleDatasetMetas();
            const area = chart.chartArea;
            for(let i = metasets.length - 1; i >= 0; --i){
                const source = metasets[i].$filler;
                if (!source) {
                    continue;
                }
                source.line.updateControlPoints(area, source.axis);
                if (draw && source.fill) {
                    _drawfill(chart.ctx, source, area);
                }
            }
        },
        beforeDatasetsDraw (chart, _args, options) {
            if (options.drawTime !== 'beforeDatasetsDraw') {
                return;
            }
            const metasets = chart.getSortedVisibleDatasetMetas();
            for(let i = metasets.length - 1; i >= 0; --i){
                const source = metasets[i].$filler;
                if (_shouldApplyFill(source)) {
                    _drawfill(chart.ctx, source, chart.chartArea);
                }
            }
        },
        beforeDatasetDraw (chart, args, options) {
            const source = args.meta.$filler;
            if (!_shouldApplyFill(source) || options.drawTime !== 'beforeDatasetDraw') {
                return;
            }
            _drawfill(chart.ctx, source, chart.chartArea);
        },
        defaults: {
            propagate: true,
            drawTime: 'beforeDatasetDraw'
        }
    };

    const getBoxSize = (labelOpts, fontSize)=>{
        let { boxHeight =fontSize , boxWidth =fontSize  } = labelOpts;
        if (labelOpts.usePointStyle) {
            boxHeight = Math.min(boxHeight, fontSize);
            boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
        }
        return {
            boxWidth,
            boxHeight,
            itemHeight: Math.max(fontSize, boxHeight)
        };
    };
    const itemsEqual = (a, b)=>a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
    class Legend extends Element {
     constructor(config){
            super();
            this._added = false;
            this.legendHitBoxes = [];
     this._hoveredItem = null;
            this.doughnutMode = false;
            this.chart = config.chart;
            this.options = config.options;
            this.ctx = config.ctx;
            this.legendItems = undefined;
            this.columnSizes = undefined;
            this.lineWidths = undefined;
            this.maxHeight = undefined;
            this.maxWidth = undefined;
            this.top = undefined;
            this.bottom = undefined;
            this.left = undefined;
            this.right = undefined;
            this.height = undefined;
            this.width = undefined;
            this._margins = undefined;
            this.position = undefined;
            this.weight = undefined;
            this.fullSize = undefined;
        }
        update(maxWidth, maxHeight, margins) {
            this.maxWidth = maxWidth;
            this.maxHeight = maxHeight;
            this._margins = margins;
            this.setDimensions();
            this.buildLabels();
            this.fit();
        }
        setDimensions() {
            if (this.isHorizontal()) {
                this.width = this.maxWidth;
                this.left = this._margins.left;
                this.right = this.width;
            } else {
                this.height = this.maxHeight;
                this.top = this._margins.top;
                this.bottom = this.height;
            }
        }
        buildLabels() {
            const labelOpts = this.options.labels || {};
            let legendItems = callback(labelOpts.generateLabels, [
                this.chart
            ], this) || [];
            if (labelOpts.filter) {
                legendItems = legendItems.filter((item)=>labelOpts.filter(item, this.chart.data));
            }
            if (labelOpts.sort) {
                legendItems = legendItems.sort((a, b)=>labelOpts.sort(a, b, this.chart.data));
            }
            if (this.options.reverse) {
                legendItems.reverse();
            }
            this.legendItems = legendItems;
        }
        fit() {
            const { options , ctx  } = this;
            if (!options.display) {
                this.width = this.height = 0;
                return;
            }
            const labelOpts = options.labels;
            const labelFont = toFont(labelOpts.font);
            const fontSize = labelFont.size;
            const titleHeight = this._computeTitleHeight();
            const { boxWidth , itemHeight  } = getBoxSize(labelOpts, fontSize);
            let width, height;
            ctx.font = labelFont.string;
            if (this.isHorizontal()) {
                width = this.maxWidth;
                height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
            } else {
                height = this.maxHeight;
                width = this._fitCols(titleHeight, labelFont, boxWidth, itemHeight) + 10;
            }
            this.width = Math.min(width, options.maxWidth || this.maxWidth);
            this.height = Math.min(height, options.maxHeight || this.maxHeight);
        }
     _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
            const { ctx , maxWidth , options: { labels: { padding  }  }  } = this;
            const hitboxes = this.legendHitBoxes = [];
            const lineWidths = this.lineWidths = [
                0
            ];
            const lineHeight = itemHeight + padding;
            let totalHeight = titleHeight;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            let row = -1;
            let top = -lineHeight;
            this.legendItems.forEach((legendItem, i)=>{
                const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
                if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
                    totalHeight += lineHeight;
                    lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
                    top += lineHeight;
                    row++;
                }
                hitboxes[i] = {
                    left: 0,
                    top,
                    row,
                    width: itemWidth,
                    height: itemHeight
                };
                lineWidths[lineWidths.length - 1] += itemWidth + padding;
            });
            return totalHeight;
        }
        _fitCols(titleHeight, labelFont, boxWidth, _itemHeight) {
            const { ctx , maxHeight , options: { labels: { padding  }  }  } = this;
            const hitboxes = this.legendHitBoxes = [];
            const columnSizes = this.columnSizes = [];
            const heightLimit = maxHeight - titleHeight;
            let totalWidth = padding;
            let currentColWidth = 0;
            let currentColHeight = 0;
            let left = 0;
            let col = 0;
            this.legendItems.forEach((legendItem, i)=>{
                const { itemWidth , itemHeight  } = calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight);
                if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
                    totalWidth += currentColWidth + padding;
                    columnSizes.push({
                        width: currentColWidth,
                        height: currentColHeight
                    });
                    left += currentColWidth + padding;
                    col++;
                    currentColWidth = currentColHeight = 0;
                }
                hitboxes[i] = {
                    left,
                    top: currentColHeight,
                    col,
                    width: itemWidth,
                    height: itemHeight
                };
                currentColWidth = Math.max(currentColWidth, itemWidth);
                currentColHeight += itemHeight + padding;
            });
            totalWidth += currentColWidth;
            columnSizes.push({
                width: currentColWidth,
                height: currentColHeight
            });
            return totalWidth;
        }
        adjustHitBoxes() {
            if (!this.options.display) {
                return;
            }
            const titleHeight = this._computeTitleHeight();
            const { legendHitBoxes: hitboxes , options: { align , labels: { padding  } , rtl  }  } = this;
            const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
            if (this.isHorizontal()) {
                let row = 0;
                let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
                for (const hitbox of hitboxes){
                    if (row !== hitbox.row) {
                        row = hitbox.row;
                        left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
                    }
                    hitbox.top += this.top + titleHeight + padding;
                    hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
                    left += hitbox.width + padding;
                }
            } else {
                let col = 0;
                let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
                for (const hitbox of hitboxes){
                    if (hitbox.col !== col) {
                        col = hitbox.col;
                        top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
                    }
                    hitbox.top = top;
                    hitbox.left += this.left + padding;
                    hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
                    top += hitbox.height + padding;
                }
            }
        }
        isHorizontal() {
            return this.options.position === 'top' || this.options.position === 'bottom';
        }
        draw() {
            if (this.options.display) {
                const ctx = this.ctx;
                clipArea(ctx, this);
                this._draw();
                unclipArea(ctx);
            }
        }
     _draw() {
            const { options: opts , columnSizes , lineWidths , ctx  } = this;
            const { align , labels: labelOpts  } = opts;
            const defaultColor = defaults.color;
            const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
            const labelFont = toFont(labelOpts.font);
            const { padding  } = labelOpts;
            const fontSize = labelFont.size;
            const halfFontSize = fontSize / 2;
            let cursor;
            this.drawTitle();
            ctx.textAlign = rtlHelper.textAlign('left');
            ctx.textBaseline = 'middle';
            ctx.lineWidth = 0.5;
            ctx.font = labelFont.string;
            const { boxWidth , boxHeight , itemHeight  } = getBoxSize(labelOpts, fontSize);
            const drawLegendBox = function(x, y, legendItem) {
                if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
                    return;
                }
                ctx.save();
                const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
                ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
                ctx.lineCap = valueOrDefault(legendItem.lineCap, 'butt');
                ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
                ctx.lineJoin = valueOrDefault(legendItem.lineJoin, 'miter');
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
                ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
                if (labelOpts.usePointStyle) {
                    const drawOptions = {
                        radius: boxHeight * Math.SQRT2 / 2,
                        pointStyle: legendItem.pointStyle,
                        rotation: legendItem.rotation,
                        borderWidth: lineWidth
                    };
                    const centerX = rtlHelper.xPlus(x, boxWidth / 2);
                    const centerY = y + halfFontSize;
                    drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
                } else {
                    const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
                    const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
                    const borderRadius = toTRBLCorners(legendItem.borderRadius);
                    ctx.beginPath();
                    if (Object.values(borderRadius).some((v)=>v !== 0)) {
                        addRoundedRectPath(ctx, {
                            x: xBoxLeft,
                            y: yBoxTop,
                            w: boxWidth,
                            h: boxHeight,
                            radius: borderRadius
                        });
                    } else {
                        ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
                    }
                    ctx.fill();
                    if (lineWidth !== 0) {
                        ctx.stroke();
                    }
                }
                ctx.restore();
            };
            const fillText = function(x, y, legendItem) {
                renderText(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
                    strikethrough: legendItem.hidden,
                    textAlign: rtlHelper.textAlign(legendItem.textAlign)
                });
            };
            const isHorizontal = this.isHorizontal();
            const titleHeight = this._computeTitleHeight();
            if (isHorizontal) {
                cursor = {
                    x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
                    y: this.top + padding + titleHeight,
                    line: 0
                };
            } else {
                cursor = {
                    x: this.left + padding,
                    y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
                    line: 0
                };
            }
            overrideTextDirection(this.ctx, opts.textDirection);
            const lineHeight = itemHeight + padding;
            this.legendItems.forEach((legendItem, i)=>{
                ctx.strokeStyle = legendItem.fontColor;
                ctx.fillStyle = legendItem.fontColor;
                const textWidth = ctx.measureText(legendItem.text).width;
                const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
                const width = boxWidth + halfFontSize + textWidth;
                let x = cursor.x;
                let y = cursor.y;
                rtlHelper.setWidth(this.width);
                if (isHorizontal) {
                    if (i > 0 && x + width + padding > this.right) {
                        y = cursor.y += lineHeight;
                        cursor.line++;
                        x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
                    }
                } else if (i > 0 && y + lineHeight > this.bottom) {
                    x = cursor.x = x + columnSizes[cursor.line].width + padding;
                    cursor.line++;
                    y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
                }
                const realX = rtlHelper.x(x);
                drawLegendBox(realX, y, legendItem);
                x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
                fillText(rtlHelper.x(x), y, legendItem);
                if (isHorizontal) {
                    cursor.x += width + padding;
                } else if (typeof legendItem.text !== 'string') {
                    const fontLineHeight = labelFont.lineHeight;
                    cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight) + padding;
                } else {
                    cursor.y += lineHeight;
                }
            });
            restoreTextDirection(this.ctx, opts.textDirection);
        }
     drawTitle() {
            const opts = this.options;
            const titleOpts = opts.title;
            const titleFont = toFont(titleOpts.font);
            const titlePadding = toPadding(titleOpts.padding);
            if (!titleOpts.display) {
                return;
            }
            const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
            const ctx = this.ctx;
            const position = titleOpts.position;
            const halfFontSize = titleFont.size / 2;
            const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
            let y;
            let left = this.left;
            let maxWidth = this.width;
            if (this.isHorizontal()) {
                maxWidth = Math.max(...this.lineWidths);
                y = this.top + topPaddingPlusHalfFontSize;
                left = _alignStartEnd(opts.align, left, this.right - maxWidth);
            } else {
                const maxHeight = this.columnSizes.reduce((acc, size)=>Math.max(acc, size.height), 0);
                y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
            }
            const x = _alignStartEnd(position, left, left + maxWidth);
            ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = titleOpts.color;
            ctx.fillStyle = titleOpts.color;
            ctx.font = titleFont.string;
            renderText(ctx, titleOpts.text, x, y, titleFont);
        }
     _computeTitleHeight() {
            const titleOpts = this.options.title;
            const titleFont = toFont(titleOpts.font);
            const titlePadding = toPadding(titleOpts.padding);
            return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
        }
     _getLegendItemAt(x, y) {
            let i, hitBox, lh;
            if (_isBetween(x, this.left, this.right) && _isBetween(y, this.top, this.bottom)) {
                lh = this.legendHitBoxes;
                for(i = 0; i < lh.length; ++i){
                    hitBox = lh[i];
                    if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
                        return this.legendItems[i];
                    }
                }
            }
            return null;
        }
     handleEvent(e) {
            const opts = this.options;
            if (!isListened(e.type, opts)) {
                return;
            }
            const hoveredItem = this._getLegendItemAt(e.x, e.y);
            if (e.type === 'mousemove' || e.type === 'mouseout') {
                const previous = this._hoveredItem;
                const sameItem = itemsEqual(previous, hoveredItem);
                if (previous && !sameItem) {
                    callback(opts.onLeave, [
                        e,
                        previous,
                        this
                    ], this);
                }
                this._hoveredItem = hoveredItem;
                if (hoveredItem && !sameItem) {
                    callback(opts.onHover, [
                        e,
                        hoveredItem,
                        this
                    ], this);
                }
            } else if (hoveredItem) {
                callback(opts.onClick, [
                    e,
                    hoveredItem,
                    this
                ], this);
            }
        }
    }
    function calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight) {
        const itemWidth = calculateItemWidth(legendItem, boxWidth, labelFont, ctx);
        const itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
        return {
            itemWidth,
            itemHeight
        };
    }
    function calculateItemWidth(legendItem, boxWidth, labelFont, ctx) {
        let legendItemText = legendItem.text;
        if (legendItemText && typeof legendItemText !== 'string') {
            legendItemText = legendItemText.reduce((a, b)=>a.length > b.length ? a : b);
        }
        return boxWidth + labelFont.size / 2 + ctx.measureText(legendItemText).width;
    }
    function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
        let itemHeight = _itemHeight;
        if (typeof legendItem.text !== 'string') {
            itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
        }
        return itemHeight;
    }
    function calculateLegendItemHeight(legendItem, fontLineHeight) {
        const labelHeight = legendItem.text ? legendItem.text.length : 0;
        return fontLineHeight * labelHeight;
    }
    function isListened(type, opts) {
        if ((type === 'mousemove' || type === 'mouseout') && (opts.onHover || opts.onLeave)) {
            return true;
        }
        if (opts.onClick && (type === 'click' || type === 'mouseup')) {
            return true;
        }
        return false;
    }
    var plugin_legend = {
        id: 'legend',
     _element: Legend,
        start (chart, _args, options) {
            const legend = chart.legend = new Legend({
                ctx: chart.ctx,
                options,
                chart
            });
            layouts.configure(chart, legend, options);
            layouts.addBox(chart, legend);
        },
        stop (chart) {
            layouts.removeBox(chart, chart.legend);
            delete chart.legend;
        },
        beforeUpdate (chart, _args, options) {
            const legend = chart.legend;
            layouts.configure(chart, legend, options);
            legend.options = options;
        },
        afterUpdate (chart) {
            const legend = chart.legend;
            legend.buildLabels();
            legend.adjustHitBoxes();
        },
        afterEvent (chart, args) {
            if (!args.replay) {
                chart.legend.handleEvent(args.event);
            }
        },
        defaults: {
            display: true,
            position: 'top',
            align: 'center',
            fullSize: true,
            reverse: false,
            weight: 1000,
            onClick (e, legendItem, legend) {
                const index = legendItem.datasetIndex;
                const ci = legend.chart;
                if (ci.isDatasetVisible(index)) {
                    ci.hide(index);
                    legendItem.hidden = true;
                } else {
                    ci.show(index);
                    legendItem.hidden = false;
                }
            },
            onHover: null,
            onLeave: null,
            labels: {
                color: (ctx)=>ctx.chart.options.color,
                boxWidth: 40,
                padding: 10,
                generateLabels (chart) {
                    const datasets = chart.data.datasets;
                    const { labels: { usePointStyle , pointStyle , textAlign , color , useBorderRadius , borderRadius  }  } = chart.legend.options;
                    return chart._getSortedDatasetMetas().map((meta)=>{
                        const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
                        const borderWidth = toPadding(style.borderWidth);
                        return {
                            text: datasets[meta.index].label,
                            fillStyle: style.backgroundColor,
                            fontColor: color,
                            hidden: !meta.visible,
                            lineCap: style.borderCapStyle,
                            lineDash: style.borderDash,
                            lineDashOffset: style.borderDashOffset,
                            lineJoin: style.borderJoinStyle,
                            lineWidth: (borderWidth.width + borderWidth.height) / 4,
                            strokeStyle: style.borderColor,
                            pointStyle: pointStyle || style.pointStyle,
                            rotation: style.rotation,
                            textAlign: textAlign || style.textAlign,
                            borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
                            datasetIndex: meta.index
                        };
                    }, this);
                }
            },
            title: {
                color: (ctx)=>ctx.chart.options.color,
                display: false,
                position: 'center',
                text: ''
            }
        },
        descriptors: {
            _scriptable: (name)=>!name.startsWith('on'),
            labels: {
                _scriptable: (name)=>![
                        'generateLabels',
                        'filter',
                        'sort'
                    ].includes(name)
            }
        }
    };

    class Title extends Element {
     constructor(config){
            super();
            this.chart = config.chart;
            this.options = config.options;
            this.ctx = config.ctx;
            this._padding = undefined;
            this.top = undefined;
            this.bottom = undefined;
            this.left = undefined;
            this.right = undefined;
            this.width = undefined;
            this.height = undefined;
            this.position = undefined;
            this.weight = undefined;
            this.fullSize = undefined;
        }
        update(maxWidth, maxHeight) {
            const opts = this.options;
            this.left = 0;
            this.top = 0;
            if (!opts.display) {
                this.width = this.height = this.right = this.bottom = 0;
                return;
            }
            this.width = this.right = maxWidth;
            this.height = this.bottom = maxHeight;
            const lineCount = isArray(opts.text) ? opts.text.length : 1;
            this._padding = toPadding(opts.padding);
            const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
            if (this.isHorizontal()) {
                this.height = textSize;
            } else {
                this.width = textSize;
            }
        }
        isHorizontal() {
            const pos = this.options.position;
            return pos === 'top' || pos === 'bottom';
        }
        _drawArgs(offset) {
            const { top , left , bottom , right , options  } = this;
            const align = options.align;
            let rotation = 0;
            let maxWidth, titleX, titleY;
            if (this.isHorizontal()) {
                titleX = _alignStartEnd(align, left, right);
                titleY = top + offset;
                maxWidth = right - left;
            } else {
                if (options.position === 'left') {
                    titleX = left + offset;
                    titleY = _alignStartEnd(align, bottom, top);
                    rotation = PI * -0.5;
                } else {
                    titleX = right - offset;
                    titleY = _alignStartEnd(align, top, bottom);
                    rotation = PI * 0.5;
                }
                maxWidth = bottom - top;
            }
            return {
                titleX,
                titleY,
                maxWidth,
                rotation
            };
        }
        draw() {
            const ctx = this.ctx;
            const opts = this.options;
            if (!opts.display) {
                return;
            }
            const fontOpts = toFont(opts.font);
            const lineHeight = fontOpts.lineHeight;
            const offset = lineHeight / 2 + this._padding.top;
            const { titleX , titleY , maxWidth , rotation  } = this._drawArgs(offset);
            renderText(ctx, opts.text, 0, 0, fontOpts, {
                color: opts.color,
                maxWidth,
                rotation,
                textAlign: _toLeftRightCenter(opts.align),
                textBaseline: 'middle',
                translation: [
                    titleX,
                    titleY
                ]
            });
        }
    }
    function createTitle(chart, titleOpts) {
        const title = new Title({
            ctx: chart.ctx,
            options: titleOpts,
            chart
        });
        layouts.configure(chart, title, titleOpts);
        layouts.addBox(chart, title);
        chart.titleBlock = title;
    }
    var plugin_title = {
        id: 'title',
     _element: Title,
        start (chart, _args, options) {
            createTitle(chart, options);
        },
        stop (chart) {
            const titleBlock = chart.titleBlock;
            layouts.removeBox(chart, titleBlock);
            delete chart.titleBlock;
        },
        beforeUpdate (chart, _args, options) {
            const title = chart.titleBlock;
            layouts.configure(chart, title, options);
            title.options = options;
        },
        defaults: {
            align: 'center',
            display: false,
            font: {
                weight: 'bold'
            },
            fullSize: true,
            padding: 10,
            position: 'top',
            text: '',
            weight: 2000
        },
        defaultRoutes: {
            color: 'color'
        },
        descriptors: {
            _scriptable: true,
            _indexable: false
        }
    };

    const map = new WeakMap();
    var plugin_subtitle = {
        id: 'subtitle',
        start (chart, _args, options) {
            const title = new Title({
                ctx: chart.ctx,
                options,
                chart
            });
            layouts.configure(chart, title, options);
            layouts.addBox(chart, title);
            map.set(chart, title);
        },
        stop (chart) {
            layouts.removeBox(chart, map.get(chart));
            map.delete(chart);
        },
        beforeUpdate (chart, _args, options) {
            const title = map.get(chart);
            layouts.configure(chart, title, options);
            title.options = options;
        },
        defaults: {
            align: 'center',
            display: false,
            font: {
                weight: 'normal'
            },
            fullSize: true,
            padding: 0,
            position: 'top',
            text: '',
            weight: 1500
        },
        defaultRoutes: {
            color: 'color'
        },
        descriptors: {
            _scriptable: true,
            _indexable: false
        }
    };

    const positioners = {
     average (items) {
            if (!items.length) {
                return false;
            }
            let i, len;
            let xSet = new Set();
            let y = 0;
            let count = 0;
            for(i = 0, len = items.length; i < len; ++i){
                const el = items[i].element;
                if (el && el.hasValue()) {
                    const pos = el.tooltipPosition();
                    xSet.add(pos.x);
                    y += pos.y;
                    ++count;
                }
            }
            const xAverage = [
                ...xSet
            ].reduce((a, b)=>a + b) / xSet.size;
            return {
                x: xAverage,
                y: y / count
            };
        },
     nearest (items, eventPosition) {
            if (!items.length) {
                return false;
            }
            let x = eventPosition.x;
            let y = eventPosition.y;
            let minDistance = Number.POSITIVE_INFINITY;
            let i, len, nearestElement;
            for(i = 0, len = items.length; i < len; ++i){
                const el = items[i].element;
                if (el && el.hasValue()) {
                    const center = el.getCenterPoint();
                    const d = distanceBetweenPoints(eventPosition, center);
                    if (d < minDistance) {
                        minDistance = d;
                        nearestElement = el;
                    }
                }
            }
            if (nearestElement) {
                const tp = nearestElement.tooltipPosition();
                x = tp.x;
                y = tp.y;
            }
            return {
                x,
                y
            };
        }
    };
    function pushOrConcat(base, toPush) {
        if (toPush) {
            if (isArray(toPush)) {
                Array.prototype.push.apply(base, toPush);
            } else {
                base.push(toPush);
            }
        }
        return base;
    }
     function splitNewlines(str) {
        if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) {
            return str.split('\n');
        }
        return str;
    }
     function createTooltipItem(chart, item) {
        const { element , datasetIndex , index  } = item;
        const controller = chart.getDatasetMeta(datasetIndex).controller;
        const { label , value  } = controller.getLabelAndValue(index);
        return {
            chart,
            label,
            parsed: controller.getParsed(index),
            raw: chart.data.datasets[datasetIndex].data[index],
            formattedValue: value,
            dataset: controller.getDataset(),
            dataIndex: index,
            datasetIndex,
            element
        };
    }
     function getTooltipSize(tooltip, options) {
        const ctx = tooltip.chart.ctx;
        const { body , footer , title  } = tooltip;
        const { boxWidth , boxHeight  } = options;
        const bodyFont = toFont(options.bodyFont);
        const titleFont = toFont(options.titleFont);
        const footerFont = toFont(options.footerFont);
        const titleLineCount = title.length;
        const footerLineCount = footer.length;
        const bodyLineItemCount = body.length;
        const padding = toPadding(options.padding);
        let height = padding.height;
        let width = 0;
        let combinedBodyLength = body.reduce((count, bodyItem)=>count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
        combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
        if (titleLineCount) {
            height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
        }
        if (combinedBodyLength) {
            const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
            height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
        }
        if (footerLineCount) {
            height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
        }
        let widthPadding = 0;
        const maxLineWidth = function(line) {
            width = Math.max(width, ctx.measureText(line).width + widthPadding);
        };
        ctx.save();
        ctx.font = titleFont.string;
        each(tooltip.title, maxLineWidth);
        ctx.font = bodyFont.string;
        each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
        widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
        each(body, (bodyItem)=>{
            each(bodyItem.before, maxLineWidth);
            each(bodyItem.lines, maxLineWidth);
            each(bodyItem.after, maxLineWidth);
        });
        widthPadding = 0;
        ctx.font = footerFont.string;
        each(tooltip.footer, maxLineWidth);
        ctx.restore();
        width += padding.width;
        return {
            width,
            height
        };
    }
    function determineYAlign(chart, size) {
        const { y , height  } = size;
        if (y < height / 2) {
            return 'top';
        } else if (y > chart.height - height / 2) {
            return 'bottom';
        }
        return 'center';
    }
    function doesNotFitWithAlign(xAlign, chart, options, size) {
        const { x , width  } = size;
        const caret = options.caretSize + options.caretPadding;
        if (xAlign === 'left' && x + width + caret > chart.width) {
            return true;
        }
        if (xAlign === 'right' && x - width - caret < 0) {
            return true;
        }
    }
    function determineXAlign(chart, options, size, yAlign) {
        const { x , width  } = size;
        const { width: chartWidth , chartArea: { left , right  }  } = chart;
        let xAlign = 'center';
        if (yAlign === 'center') {
            xAlign = x <= (left + right) / 2 ? 'left' : 'right';
        } else if (x <= width / 2) {
            xAlign = 'left';
        } else if (x >= chartWidth - width / 2) {
            xAlign = 'right';
        }
        if (doesNotFitWithAlign(xAlign, chart, options, size)) {
            xAlign = 'center';
        }
        return xAlign;
    }
     function determineAlignment(chart, options, size) {
        const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
        return {
            xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
            yAlign
        };
    }
    function alignX(size, xAlign) {
        let { x , width  } = size;
        if (xAlign === 'right') {
            x -= width;
        } else if (xAlign === 'center') {
            x -= width / 2;
        }
        return x;
    }
    function alignY(size, yAlign, paddingAndSize) {
        let { y , height  } = size;
        if (yAlign === 'top') {
            y += paddingAndSize;
        } else if (yAlign === 'bottom') {
            y -= height + paddingAndSize;
        } else {
            y -= height / 2;
        }
        return y;
    }
     function getBackgroundPoint(options, size, alignment, chart) {
        const { caretSize , caretPadding , cornerRadius  } = options;
        const { xAlign , yAlign  } = alignment;
        const paddingAndSize = caretSize + caretPadding;
        const { topLeft , topRight , bottomLeft , bottomRight  } = toTRBLCorners(cornerRadius);
        let x = alignX(size, xAlign);
        const y = alignY(size, yAlign, paddingAndSize);
        if (yAlign === 'center') {
            if (xAlign === 'left') {
                x += paddingAndSize;
            } else if (xAlign === 'right') {
                x -= paddingAndSize;
            }
        } else if (xAlign === 'left') {
            x -= Math.max(topLeft, bottomLeft) + caretSize;
        } else if (xAlign === 'right') {
            x += Math.max(topRight, bottomRight) + caretSize;
        }
        return {
            x: _limitValue(x, 0, chart.width - size.width),
            y: _limitValue(y, 0, chart.height - size.height)
        };
    }
    function getAlignedX(tooltip, align, options) {
        const padding = toPadding(options.padding);
        return align === 'center' ? tooltip.x + tooltip.width / 2 : align === 'right' ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
    }
     function getBeforeAfterBodyLines(callback) {
        return pushOrConcat([], splitNewlines(callback));
    }
    function createTooltipContext(parent, tooltip, tooltipItems) {
        return createContext(parent, {
            tooltip,
            tooltipItems,
            type: 'tooltip'
        });
    }
    function overrideCallbacks(callbacks, context) {
        const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
        return override ? callbacks.override(override) : callbacks;
    }
    const defaultCallbacks = {
        beforeTitle: noop,
        title (tooltipItems) {
            if (tooltipItems.length > 0) {
                const item = tooltipItems[0];
                const labels = item.chart.data.labels;
                const labelCount = labels ? labels.length : 0;
                if (this && this.options && this.options.mode === 'dataset') {
                    return item.dataset.label || '';
                } else if (item.label) {
                    return item.label;
                } else if (labelCount > 0 && item.dataIndex < labelCount) {
                    return labels[item.dataIndex];
                }
            }
            return '';
        },
        afterTitle: noop,
        beforeBody: noop,
        beforeLabel: noop,
        label (tooltipItem) {
            if (this && this.options && this.options.mode === 'dataset') {
                return tooltipItem.label + ': ' + tooltipItem.formattedValue || tooltipItem.formattedValue;
            }
            let label = tooltipItem.dataset.label || '';
            if (label) {
                label += ': ';
            }
            const value = tooltipItem.formattedValue;
            if (!isNullOrUndef(value)) {
                label += value;
            }
            return label;
        },
        labelColor (tooltipItem) {
            const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
            const options = meta.controller.getStyle(tooltipItem.dataIndex);
            return {
                borderColor: options.borderColor,
                backgroundColor: options.backgroundColor,
                borderWidth: options.borderWidth,
                borderDash: options.borderDash,
                borderDashOffset: options.borderDashOffset,
                borderRadius: 0
            };
        },
        labelTextColor () {
            return this.options.bodyColor;
        },
        labelPointStyle (tooltipItem) {
            const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
            const options = meta.controller.getStyle(tooltipItem.dataIndex);
            return {
                pointStyle: options.pointStyle,
                rotation: options.rotation
            };
        },
        afterLabel: noop,
        afterBody: noop,
        beforeFooter: noop,
        footer: noop,
        afterFooter: noop
    };
     function invokeCallbackWithFallback(callbacks, name, ctx, arg) {
        const result = callbacks[name].call(ctx, arg);
        if (typeof result === 'undefined') {
            return defaultCallbacks[name].call(ctx, arg);
        }
        return result;
    }
    class Tooltip extends Element {
     static positioners = positioners;
        constructor(config){
            super();
            this.opacity = 0;
            this._active = [];
            this._eventPosition = undefined;
            this._size = undefined;
            this._cachedAnimations = undefined;
            this._tooltipItems = [];
            this.$animations = undefined;
            this.$context = undefined;
            this.chart = config.chart;
            this.options = config.options;
            this.dataPoints = undefined;
            this.title = undefined;
            this.beforeBody = undefined;
            this.body = undefined;
            this.afterBody = undefined;
            this.footer = undefined;
            this.xAlign = undefined;
            this.yAlign = undefined;
            this.x = undefined;
            this.y = undefined;
            this.height = undefined;
            this.width = undefined;
            this.caretX = undefined;
            this.caretY = undefined;
            this.labelColors = undefined;
            this.labelPointStyles = undefined;
            this.labelTextColors = undefined;
        }
        initialize(options) {
            this.options = options;
            this._cachedAnimations = undefined;
            this.$context = undefined;
        }
     _resolveAnimations() {
            const cached = this._cachedAnimations;
            if (cached) {
                return cached;
            }
            const chart = this.chart;
            const options = this.options.setContext(this.getContext());
            const opts = options.enabled && chart.options.animation && options.animations;
            const animations = new Animations(this.chart, opts);
            if (opts._cacheable) {
                this._cachedAnimations = Object.freeze(animations);
            }
            return animations;
        }
     getContext() {
            return this.$context || (this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
        }
        getTitle(context, options) {
            const { callbacks  } = options;
            const beforeTitle = invokeCallbackWithFallback(callbacks, 'beforeTitle', this, context);
            const title = invokeCallbackWithFallback(callbacks, 'title', this, context);
            const afterTitle = invokeCallbackWithFallback(callbacks, 'afterTitle', this, context);
            let lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeTitle));
            lines = pushOrConcat(lines, splitNewlines(title));
            lines = pushOrConcat(lines, splitNewlines(afterTitle));
            return lines;
        }
        getBeforeBody(tooltipItems, options) {
            return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, 'beforeBody', this, tooltipItems));
        }
        getBody(tooltipItems, options) {
            const { callbacks  } = options;
            const bodyItems = [];
            each(tooltipItems, (context)=>{
                const bodyItem = {
                    before: [],
                    lines: [],
                    after: []
                };
                const scoped = overrideCallbacks(callbacks, context);
                pushOrConcat(bodyItem.before, splitNewlines(invokeCallbackWithFallback(scoped, 'beforeLabel', this, context)));
                pushOrConcat(bodyItem.lines, invokeCallbackWithFallback(scoped, 'label', this, context));
                pushOrConcat(bodyItem.after, splitNewlines(invokeCallbackWithFallback(scoped, 'afterLabel', this, context)));
                bodyItems.push(bodyItem);
            });
            return bodyItems;
        }
        getAfterBody(tooltipItems, options) {
            return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, 'afterBody', this, tooltipItems));
        }
        getFooter(tooltipItems, options) {
            const { callbacks  } = options;
            const beforeFooter = invokeCallbackWithFallback(callbacks, 'beforeFooter', this, tooltipItems);
            const footer = invokeCallbackWithFallback(callbacks, 'footer', this, tooltipItems);
            const afterFooter = invokeCallbackWithFallback(callbacks, 'afterFooter', this, tooltipItems);
            let lines = [];
            lines = pushOrConcat(lines, splitNewlines(beforeFooter));
            lines = pushOrConcat(lines, splitNewlines(footer));
            lines = pushOrConcat(lines, splitNewlines(afterFooter));
            return lines;
        }
     _createItems(options) {
            const active = this._active;
            const data = this.chart.data;
            const labelColors = [];
            const labelPointStyles = [];
            const labelTextColors = [];
            let tooltipItems = [];
            let i, len;
            for(i = 0, len = active.length; i < len; ++i){
                tooltipItems.push(createTooltipItem(this.chart, active[i]));
            }
            if (options.filter) {
                tooltipItems = tooltipItems.filter((element, index, array)=>options.filter(element, index, array, data));
            }
            if (options.itemSort) {
                tooltipItems = tooltipItems.sort((a, b)=>options.itemSort(a, b, data));
            }
            each(tooltipItems, (context)=>{
                const scoped = overrideCallbacks(options.callbacks, context);
                labelColors.push(invokeCallbackWithFallback(scoped, 'labelColor', this, context));
                labelPointStyles.push(invokeCallbackWithFallback(scoped, 'labelPointStyle', this, context));
                labelTextColors.push(invokeCallbackWithFallback(scoped, 'labelTextColor', this, context));
            });
            this.labelColors = labelColors;
            this.labelPointStyles = labelPointStyles;
            this.labelTextColors = labelTextColors;
            this.dataPoints = tooltipItems;
            return tooltipItems;
        }
        update(changed, replay) {
            const options = this.options.setContext(this.getContext());
            const active = this._active;
            let properties;
            let tooltipItems = [];
            if (!active.length) {
                if (this.opacity !== 0) {
                    properties = {
                        opacity: 0
                    };
                }
            } else {
                const position = positioners[options.position].call(this, active, this._eventPosition);
                tooltipItems = this._createItems(options);
                this.title = this.getTitle(tooltipItems, options);
                this.beforeBody = this.getBeforeBody(tooltipItems, options);
                this.body = this.getBody(tooltipItems, options);
                this.afterBody = this.getAfterBody(tooltipItems, options);
                this.footer = this.getFooter(tooltipItems, options);
                const size = this._size = getTooltipSize(this, options);
                const positionAndSize = Object.assign({}, position, size);
                const alignment = determineAlignment(this.chart, options, positionAndSize);
                const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
                this.xAlign = alignment.xAlign;
                this.yAlign = alignment.yAlign;
                properties = {
                    opacity: 1,
                    x: backgroundPoint.x,
                    y: backgroundPoint.y,
                    width: size.width,
                    height: size.height,
                    caretX: position.x,
                    caretY: position.y
                };
            }
            this._tooltipItems = tooltipItems;
            this.$context = undefined;
            if (properties) {
                this._resolveAnimations().update(this, properties);
            }
            if (changed && options.external) {
                options.external.call(this, {
                    chart: this.chart,
                    tooltip: this,
                    replay
                });
            }
        }
        drawCaret(tooltipPoint, ctx, size, options) {
            const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
            ctx.lineTo(caretPosition.x1, caretPosition.y1);
            ctx.lineTo(caretPosition.x2, caretPosition.y2);
            ctx.lineTo(caretPosition.x3, caretPosition.y3);
        }
        getCaretPosition(tooltipPoint, size, options) {
            const { xAlign , yAlign  } = this;
            const { caretSize , cornerRadius  } = options;
            const { topLeft , topRight , bottomLeft , bottomRight  } = toTRBLCorners(cornerRadius);
            const { x: ptX , y: ptY  } = tooltipPoint;
            const { width , height  } = size;
            let x1, x2, x3, y1, y2, y3;
            if (yAlign === 'center') {
                y2 = ptY + height / 2;
                if (xAlign === 'left') {
                    x1 = ptX;
                    x2 = x1 - caretSize;
                    y1 = y2 + caretSize;
                    y3 = y2 - caretSize;
                } else {
                    x1 = ptX + width;
                    x2 = x1 + caretSize;
                    y1 = y2 - caretSize;
                    y3 = y2 + caretSize;
                }
                x3 = x1;
            } else {
                if (xAlign === 'left') {
                    x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
                } else if (xAlign === 'right') {
                    x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
                } else {
                    x2 = this.caretX;
                }
                if (yAlign === 'top') {
                    y1 = ptY;
                    y2 = y1 - caretSize;
                    x1 = x2 - caretSize;
                    x3 = x2 + caretSize;
                } else {
                    y1 = ptY + height;
                    y2 = y1 + caretSize;
                    x1 = x2 + caretSize;
                    x3 = x2 - caretSize;
                }
                y3 = y1;
            }
            return {
                x1,
                x2,
                x3,
                y1,
                y2,
                y3
            };
        }
        drawTitle(pt, ctx, options) {
            const title = this.title;
            const length = title.length;
            let titleFont, titleSpacing, i;
            if (length) {
                const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
                pt.x = getAlignedX(this, options.titleAlign, options);
                ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
                ctx.textBaseline = 'middle';
                titleFont = toFont(options.titleFont);
                titleSpacing = options.titleSpacing;
                ctx.fillStyle = options.titleColor;
                ctx.font = titleFont.string;
                for(i = 0; i < length; ++i){
                    ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
                    pt.y += titleFont.lineHeight + titleSpacing;
                    if (i + 1 === length) {
                        pt.y += options.titleMarginBottom - titleSpacing;
                    }
                }
            }
        }
     _drawColorBox(ctx, pt, i, rtlHelper, options) {
            const labelColor = this.labelColors[i];
            const labelPointStyle = this.labelPointStyles[i];
            const { boxHeight , boxWidth  } = options;
            const bodyFont = toFont(options.bodyFont);
            const colorX = getAlignedX(this, 'left', options);
            const rtlColorX = rtlHelper.x(colorX);
            const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
            const colorY = pt.y + yOffSet;
            if (options.usePointStyle) {
                const drawOptions = {
                    radius: Math.min(boxWidth, boxHeight) / 2,
                    pointStyle: labelPointStyle.pointStyle,
                    rotation: labelPointStyle.rotation,
                    borderWidth: 1
                };
                const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
                const centerY = colorY + boxHeight / 2;
                ctx.strokeStyle = options.multiKeyBackground;
                ctx.fillStyle = options.multiKeyBackground;
                drawPoint(ctx, drawOptions, centerX, centerY);
                ctx.strokeStyle = labelColor.borderColor;
                ctx.fillStyle = labelColor.backgroundColor;
                drawPoint(ctx, drawOptions, centerX, centerY);
            } else {
                ctx.lineWidth = isObject(labelColor.borderWidth) ? Math.max(...Object.values(labelColor.borderWidth)) : labelColor.borderWidth || 1;
                ctx.strokeStyle = labelColor.borderColor;
                ctx.setLineDash(labelColor.borderDash || []);
                ctx.lineDashOffset = labelColor.borderDashOffset || 0;
                const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth);
                const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - 2);
                const borderRadius = toTRBLCorners(labelColor.borderRadius);
                if (Object.values(borderRadius).some((v)=>v !== 0)) {
                    ctx.beginPath();
                    ctx.fillStyle = options.multiKeyBackground;
                    addRoundedRectPath(ctx, {
                        x: outerX,
                        y: colorY,
                        w: boxWidth,
                        h: boxHeight,
                        radius: borderRadius
                    });
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = labelColor.backgroundColor;
                    ctx.beginPath();
                    addRoundedRectPath(ctx, {
                        x: innerX,
                        y: colorY + 1,
                        w: boxWidth - 2,
                        h: boxHeight - 2,
                        radius: borderRadius
                    });
                    ctx.fill();
                } else {
                    ctx.fillStyle = options.multiKeyBackground;
                    ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
                    ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
                    ctx.fillStyle = labelColor.backgroundColor;
                    ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
                }
            }
            ctx.fillStyle = this.labelTextColors[i];
        }
        drawBody(pt, ctx, options) {
            const { body  } = this;
            const { bodySpacing , bodyAlign , displayColors , boxHeight , boxWidth , boxPadding  } = options;
            const bodyFont = toFont(options.bodyFont);
            let bodyLineHeight = bodyFont.lineHeight;
            let xLinePadding = 0;
            const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
            const fillLineOfText = function(line) {
                ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
                pt.y += bodyLineHeight + bodySpacing;
            };
            const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
            let bodyItem, textColor, lines, i, j, ilen, jlen;
            ctx.textAlign = bodyAlign;
            ctx.textBaseline = 'middle';
            ctx.font = bodyFont.string;
            pt.x = getAlignedX(this, bodyAlignForCalculation, options);
            ctx.fillStyle = options.bodyColor;
            each(this.beforeBody, fillLineOfText);
            xLinePadding = displayColors && bodyAlignForCalculation !== 'right' ? bodyAlign === 'center' ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
            for(i = 0, ilen = body.length; i < ilen; ++i){
                bodyItem = body[i];
                textColor = this.labelTextColors[i];
                ctx.fillStyle = textColor;
                each(bodyItem.before, fillLineOfText);
                lines = bodyItem.lines;
                if (displayColors && lines.length) {
                    this._drawColorBox(ctx, pt, i, rtlHelper, options);
                    bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
                }
                for(j = 0, jlen = lines.length; j < jlen; ++j){
                    fillLineOfText(lines[j]);
                    bodyLineHeight = bodyFont.lineHeight;
                }
                each(bodyItem.after, fillLineOfText);
            }
            xLinePadding = 0;
            bodyLineHeight = bodyFont.lineHeight;
            each(this.afterBody, fillLineOfText);
            pt.y -= bodySpacing;
        }
        drawFooter(pt, ctx, options) {
            const footer = this.footer;
            const length = footer.length;
            let footerFont, i;
            if (length) {
                const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
                pt.x = getAlignedX(this, options.footerAlign, options);
                pt.y += options.footerMarginTop;
                ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
                ctx.textBaseline = 'middle';
                footerFont = toFont(options.footerFont);
                ctx.fillStyle = options.footerColor;
                ctx.font = footerFont.string;
                for(i = 0; i < length; ++i){
                    ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
                    pt.y += footerFont.lineHeight + options.footerSpacing;
                }
            }
        }
        drawBackground(pt, ctx, tooltipSize, options) {
            const { xAlign , yAlign  } = this;
            const { x , y  } = pt;
            const { width , height  } = tooltipSize;
            const { topLeft , topRight , bottomLeft , bottomRight  } = toTRBLCorners(options.cornerRadius);
            ctx.fillStyle = options.backgroundColor;
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            ctx.beginPath();
            ctx.moveTo(x + topLeft, y);
            if (yAlign === 'top') {
                this.drawCaret(pt, ctx, tooltipSize, options);
            }
            ctx.lineTo(x + width - topRight, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
            if (yAlign === 'center' && xAlign === 'right') {
                this.drawCaret(pt, ctx, tooltipSize, options);
            }
            ctx.lineTo(x + width, y + height - bottomRight);
            ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
            if (yAlign === 'bottom') {
                this.drawCaret(pt, ctx, tooltipSize, options);
            }
            ctx.lineTo(x + bottomLeft, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
            if (yAlign === 'center' && xAlign === 'left') {
                this.drawCaret(pt, ctx, tooltipSize, options);
            }
            ctx.lineTo(x, y + topLeft);
            ctx.quadraticCurveTo(x, y, x + topLeft, y);
            ctx.closePath();
            ctx.fill();
            if (options.borderWidth > 0) {
                ctx.stroke();
            }
        }
     _updateAnimationTarget(options) {
            const chart = this.chart;
            const anims = this.$animations;
            const animX = anims && anims.x;
            const animY = anims && anims.y;
            if (animX || animY) {
                const position = positioners[options.position].call(this, this._active, this._eventPosition);
                if (!position) {
                    return;
                }
                const size = this._size = getTooltipSize(this, options);
                const positionAndSize = Object.assign({}, position, this._size);
                const alignment = determineAlignment(chart, options, positionAndSize);
                const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
                if (animX._to !== point.x || animY._to !== point.y) {
                    this.xAlign = alignment.xAlign;
                    this.yAlign = alignment.yAlign;
                    this.width = size.width;
                    this.height = size.height;
                    this.caretX = position.x;
                    this.caretY = position.y;
                    this._resolveAnimations().update(this, point);
                }
            }
        }
     _willRender() {
            return !!this.opacity;
        }
        draw(ctx) {
            const options = this.options.setContext(this.getContext());
            let opacity = this.opacity;
            if (!opacity) {
                return;
            }
            this._updateAnimationTarget(options);
            const tooltipSize = {
                width: this.width,
                height: this.height
            };
            const pt = {
                x: this.x,
                y: this.y
            };
            opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
            const padding = toPadding(options.padding);
            const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
            if (options.enabled && hasTooltipContent) {
                ctx.save();
                ctx.globalAlpha = opacity;
                this.drawBackground(pt, ctx, tooltipSize, options);
                overrideTextDirection(ctx, options.textDirection);
                pt.y += padding.top;
                this.drawTitle(pt, ctx, options);
                this.drawBody(pt, ctx, options);
                this.drawFooter(pt, ctx, options);
                restoreTextDirection(ctx, options.textDirection);
                ctx.restore();
            }
        }
     getActiveElements() {
            return this._active || [];
        }
     setActiveElements(activeElements, eventPosition) {
            const lastActive = this._active;
            const active = activeElements.map(({ datasetIndex , index  })=>{
                const meta = this.chart.getDatasetMeta(datasetIndex);
                if (!meta) {
                    throw new Error('Cannot find a dataset at index ' + datasetIndex);
                }
                return {
                    datasetIndex,
                    element: meta.data[index],
                    index
                };
            });
            const changed = !_elementsEqual(lastActive, active);
            const positionChanged = this._positionChanged(active, eventPosition);
            if (changed || positionChanged) {
                this._active = active;
                this._eventPosition = eventPosition;
                this._ignoreReplayEvents = true;
                this.update(true);
            }
        }
     handleEvent(e, replay, inChartArea = true) {
            if (replay && this._ignoreReplayEvents) {
                return false;
            }
            this._ignoreReplayEvents = false;
            const options = this.options;
            const lastActive = this._active || [];
            const active = this._getActiveElements(e, lastActive, replay, inChartArea);
            const positionChanged = this._positionChanged(active, e);
            const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
            if (changed) {
                this._active = active;
                if (options.enabled || options.external) {
                    this._eventPosition = {
                        x: e.x,
                        y: e.y
                    };
                    this.update(true, replay);
                }
            }
            return changed;
        }
     _getActiveElements(e, lastActive, replay, inChartArea) {
            const options = this.options;
            if (e.type === 'mouseout') {
                return [];
            }
            if (!inChartArea) {
                return lastActive.filter((i)=>this.chart.data.datasets[i.datasetIndex] && this.chart.getDatasetMeta(i.datasetIndex).controller.getParsed(i.index) !== undefined);
            }
            const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
            if (options.reverse) {
                active.reverse();
            }
            return active;
        }
     _positionChanged(active, e) {
            const { caretX , caretY , options  } = this;
            const position = positioners[options.position].call(this, active, e);
            return position !== false && (caretX !== position.x || caretY !== position.y);
        }
    }
    var plugin_tooltip = {
        id: 'tooltip',
        _element: Tooltip,
        positioners,
        afterInit (chart, _args, options) {
            if (options) {
                chart.tooltip = new Tooltip({
                    chart,
                    options
                });
            }
        },
        beforeUpdate (chart, _args, options) {
            if (chart.tooltip) {
                chart.tooltip.initialize(options);
            }
        },
        reset (chart, _args, options) {
            if (chart.tooltip) {
                chart.tooltip.initialize(options);
            }
        },
        afterDraw (chart) {
            const tooltip = chart.tooltip;
            if (tooltip && tooltip._willRender()) {
                const args = {
                    tooltip
                };
                if (chart.notifyPlugins('beforeTooltipDraw', {
                    ...args,
                    cancelable: true
                }) === false) {
                    return;
                }
                tooltip.draw(chart.ctx);
                chart.notifyPlugins('afterTooltipDraw', args);
            }
        },
        afterEvent (chart, args) {
            if (chart.tooltip) {
                const useFinalPosition = args.replay;
                if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
                    args.changed = true;
                }
            }
        },
        defaults: {
            enabled: true,
            external: null,
            position: 'average',
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#fff',
            titleFont: {
                weight: 'bold'
            },
            titleSpacing: 2,
            titleMarginBottom: 6,
            titleAlign: 'left',
            bodyColor: '#fff',
            bodySpacing: 2,
            bodyFont: {},
            bodyAlign: 'left',
            footerColor: '#fff',
            footerSpacing: 2,
            footerMarginTop: 6,
            footerFont: {
                weight: 'bold'
            },
            footerAlign: 'left',
            padding: 6,
            caretPadding: 2,
            caretSize: 5,
            cornerRadius: 6,
            boxHeight: (ctx, opts)=>opts.bodyFont.size,
            boxWidth: (ctx, opts)=>opts.bodyFont.size,
            multiKeyBackground: '#fff',
            displayColors: true,
            boxPadding: 0,
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            animation: {
                duration: 400,
                easing: 'easeOutQuart'
            },
            animations: {
                numbers: {
                    type: 'number',
                    properties: [
                        'x',
                        'y',
                        'width',
                        'height',
                        'caretX',
                        'caretY'
                    ]
                },
                opacity: {
                    easing: 'linear',
                    duration: 200
                }
            },
            callbacks: defaultCallbacks
        },
        defaultRoutes: {
            bodyFont: 'font',
            footerFont: 'font',
            titleFont: 'font'
        },
        descriptors: {
            _scriptable: (name)=>name !== 'filter' && name !== 'itemSort' && name !== 'external',
            _indexable: false,
            callbacks: {
                _scriptable: false,
                _indexable: false
            },
            animation: {
                _fallback: false
            },
            animations: {
                _fallback: 'animation'
            }
        },
        additionalOptionScopes: [
            'interaction'
        ]
    };

    var plugins = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Colors: plugin_colors,
    Decimation: plugin_decimation,
    Filler: index,
    Legend: plugin_legend,
    SubTitle: plugin_subtitle,
    Title: plugin_title,
    Tooltip: plugin_tooltip
    });

    const addIfString = (labels, raw, index, addedLabels)=>{
        if (typeof raw === 'string') {
            index = labels.push(raw) - 1;
            addedLabels.unshift({
                index,
                label: raw
            });
        } else if (isNaN(raw)) {
            index = null;
        }
        return index;
    };
    function findOrAddLabel(labels, raw, index, addedLabels) {
        const first = labels.indexOf(raw);
        if (first === -1) {
            return addIfString(labels, raw, index, addedLabels);
        }
        const last = labels.lastIndexOf(raw);
        return first !== last ? index : first;
    }
    const validIndex = (index, max)=>index === null ? null : _limitValue(Math.round(index), 0, max);
    function _getLabelForValue(value) {
        const labels = this.getLabels();
        if (value >= 0 && value < labels.length) {
            return labels[value];
        }
        return value;
    }
    class CategoryScale extends Scale {
        static id = 'category';
     static defaults = {
            ticks: {
                callback: _getLabelForValue
            }
        };
        constructor(cfg){
            super(cfg);
             this._startValue = undefined;
            this._valueRange = 0;
            this._addedLabels = [];
        }
        init(scaleOptions) {
            const added = this._addedLabels;
            if (added.length) {
                const labels = this.getLabels();
                for (const { index , label  } of added){
                    if (labels[index] === label) {
                        labels.splice(index, 1);
                    }
                }
                this._addedLabels = [];
            }
            super.init(scaleOptions);
        }
        parse(raw, index) {
            if (isNullOrUndef(raw)) {
                return null;
            }
            const labels = this.getLabels();
            index = isFinite(index) && labels[index] === raw ? index : findOrAddLabel(labels, raw, valueOrDefault(index, raw), this._addedLabels);
            return validIndex(index, labels.length - 1);
        }
        determineDataLimits() {
            const { minDefined , maxDefined  } = this.getUserBounds();
            let { min , max  } = this.getMinMax(true);
            if (this.options.bounds === 'ticks') {
                if (!minDefined) {
                    min = 0;
                }
                if (!maxDefined) {
                    max = this.getLabels().length - 1;
                }
            }
            this.min = min;
            this.max = max;
        }
        buildTicks() {
            const min = this.min;
            const max = this.max;
            const offset = this.options.offset;
            const ticks = [];
            let labels = this.getLabels();
            labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
            this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
            this._startValue = this.min - (offset ? 0.5 : 0);
            for(let value = min; value <= max; value++){
                ticks.push({
                    value
                });
            }
            return ticks;
        }
        getLabelForValue(value) {
            return _getLabelForValue.call(this, value);
        }
     configure() {
            super.configure();
            if (!this.isHorizontal()) {
                this._reversePixels = !this._reversePixels;
            }
        }
        getPixelForValue(value) {
            if (typeof value !== 'number') {
                value = this.parse(value);
            }
            return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
        }
        getPixelForTick(index) {
            const ticks = this.ticks;
            if (index < 0 || index > ticks.length - 1) {
                return null;
            }
            return this.getPixelForValue(ticks[index].value);
        }
        getValueForPixel(pixel) {
            return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
        }
        getBasePixel() {
            return this.bottom;
        }
    }

    function generateTicks$1(generationOptions, dataRange) {
        const ticks = [];
        const MIN_SPACING = 1e-14;
        const { bounds , step , min , max , precision , count , maxTicks , maxDigits , includeBounds  } = generationOptions;
        const unit = step || 1;
        const maxSpaces = maxTicks - 1;
        const { min: rmin , max: rmax  } = dataRange;
        const minDefined = !isNullOrUndef(min);
        const maxDefined = !isNullOrUndef(max);
        const countDefined = !isNullOrUndef(count);
        const minSpacing = (rmax - rmin) / (maxDigits + 1);
        let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
        let factor, niceMin, niceMax, numSpaces;
        if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
            return [
                {
                    value: rmin
                },
                {
                    value: rmax
                }
            ];
        }
        numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
        if (numSpaces > maxSpaces) {
            spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
        }
        if (!isNullOrUndef(precision)) {
            factor = Math.pow(10, precision);
            spacing = Math.ceil(spacing * factor) / factor;
        }
        if (bounds === 'ticks') {
            niceMin = Math.floor(rmin / spacing) * spacing;
            niceMax = Math.ceil(rmax / spacing) * spacing;
        } else {
            niceMin = rmin;
            niceMax = rmax;
        }
        if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1000)) {
            numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
            spacing = (max - min) / numSpaces;
            niceMin = min;
            niceMax = max;
        } else if (countDefined) {
            niceMin = minDefined ? min : niceMin;
            niceMax = maxDefined ? max : niceMax;
            numSpaces = count - 1;
            spacing = (niceMax - niceMin) / numSpaces;
        } else {
            numSpaces = (niceMax - niceMin) / spacing;
            if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
                numSpaces = Math.round(numSpaces);
            } else {
                numSpaces = Math.ceil(numSpaces);
            }
        }
        const decimalPlaces = Math.max(_decimalPlaces(spacing), _decimalPlaces(niceMin));
        factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
        niceMin = Math.round(niceMin * factor) / factor;
        niceMax = Math.round(niceMax * factor) / factor;
        let j = 0;
        if (minDefined) {
            if (includeBounds && niceMin !== min) {
                ticks.push({
                    value: min
                });
                if (niceMin < min) {
                    j++;
                }
                if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
                    j++;
                }
            } else if (niceMin < min) {
                j++;
            }
        }
        for(; j < numSpaces; ++j){
            const tickValue = Math.round((niceMin + j * spacing) * factor) / factor;
            if (maxDefined && tickValue > max) {
                break;
            }
            ticks.push({
                value: tickValue
            });
        }
        if (maxDefined && includeBounds && niceMax !== max) {
            if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
                ticks[ticks.length - 1].value = max;
            } else {
                ticks.push({
                    value: max
                });
            }
        } else if (!maxDefined || niceMax === max) {
            ticks.push({
                value: niceMax
            });
        }
        return ticks;
    }
    function relativeLabelSize(value, minSpacing, { horizontal , minRotation  }) {
        const rad = toRadians(minRotation);
        const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001;
        const length = 0.75 * minSpacing * ('' + value).length;
        return Math.min(minSpacing / ratio, length);
    }
    class LinearScaleBase extends Scale {
        constructor(cfg){
            super(cfg);
             this.start = undefined;
             this.end = undefined;
             this._startValue = undefined;
             this._endValue = undefined;
            this._valueRange = 0;
        }
        parse(raw, index) {
            if (isNullOrUndef(raw)) {
                return null;
            }
            if ((typeof raw === 'number' || raw instanceof Number) && !isFinite(+raw)) {
                return null;
            }
            return +raw;
        }
        handleTickRangeOptions() {
            const { beginAtZero  } = this.options;
            const { minDefined , maxDefined  } = this.getUserBounds();
            let { min , max  } = this;
            const setMin = (v)=>min = minDefined ? min : v;
            const setMax = (v)=>max = maxDefined ? max : v;
            if (beginAtZero) {
                const minSign = sign(min);
                const maxSign = sign(max);
                if (minSign < 0 && maxSign < 0) {
                    setMax(0);
                } else if (minSign > 0 && maxSign > 0) {
                    setMin(0);
                }
            }
            if (min === max) {
                let offset = max === 0 ? 1 : Math.abs(max * 0.05);
                setMax(max + offset);
                if (!beginAtZero) {
                    setMin(min - offset);
                }
            }
            this.min = min;
            this.max = max;
        }
        getTickLimit() {
            const tickOpts = this.options.ticks;
            let { maxTicksLimit , stepSize  } = tickOpts;
            let maxTicks;
            if (stepSize) {
                maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
                if (maxTicks > 1000) {
                    console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
                    maxTicks = 1000;
                }
            } else {
                maxTicks = this.computeTickLimit();
                maxTicksLimit = maxTicksLimit || 11;
            }
            if (maxTicksLimit) {
                maxTicks = Math.min(maxTicksLimit, maxTicks);
            }
            return maxTicks;
        }
     computeTickLimit() {
            return Number.POSITIVE_INFINITY;
        }
        buildTicks() {
            const opts = this.options;
            const tickOpts = opts.ticks;
            let maxTicks = this.getTickLimit();
            maxTicks = Math.max(2, maxTicks);
            const numericGeneratorOptions = {
                maxTicks,
                bounds: opts.bounds,
                min: opts.min,
                max: opts.max,
                precision: tickOpts.precision,
                step: tickOpts.stepSize,
                count: tickOpts.count,
                maxDigits: this._maxDigits(),
                horizontal: this.isHorizontal(),
                minRotation: tickOpts.minRotation || 0,
                includeBounds: tickOpts.includeBounds !== false
            };
            const dataRange = this._range || this;
            const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
            if (opts.bounds === 'ticks') {
                _setMinAndMaxByKey(ticks, this, 'value');
            }
            if (opts.reverse) {
                ticks.reverse();
                this.start = this.max;
                this.end = this.min;
            } else {
                this.start = this.min;
                this.end = this.max;
            }
            return ticks;
        }
     configure() {
            const ticks = this.ticks;
            let start = this.min;
            let end = this.max;
            super.configure();
            if (this.options.offset && ticks.length) {
                const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
                start -= offset;
                end += offset;
            }
            this._startValue = start;
            this._endValue = end;
            this._valueRange = end - start;
        }
        getLabelForValue(value) {
            return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
        }
    }

    class LinearScale extends LinearScaleBase {
        static id = 'linear';
     static defaults = {
            ticks: {
                callback: Ticks.formatters.numeric
            }
        };
        determineDataLimits() {
            const { min , max  } = this.getMinMax(true);
            this.min = isNumberFinite(min) ? min : 0;
            this.max = isNumberFinite(max) ? max : 1;
            this.handleTickRangeOptions();
        }
     computeTickLimit() {
            const horizontal = this.isHorizontal();
            const length = horizontal ? this.width : this.height;
            const minRotation = toRadians(this.options.ticks.minRotation);
            const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 0.001;
            const tickFont = this._resolveTickFontOptions(0);
            return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
        }
        getPixelForValue(value) {
            return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
        }
        getValueForPixel(pixel) {
            return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
        }
    }

    const log10Floor = (v)=>Math.floor(log10(v));
    const changeExponent = (v, m)=>Math.pow(10, log10Floor(v) + m);
    function isMajor(tickVal) {
        const remain = tickVal / Math.pow(10, log10Floor(tickVal));
        return remain === 1;
    }
    function steps(min, max, rangeExp) {
        const rangeStep = Math.pow(10, rangeExp);
        const start = Math.floor(min / rangeStep);
        const end = Math.ceil(max / rangeStep);
        return end - start;
    }
    function startExp(min, max) {
        const range = max - min;
        let rangeExp = log10Floor(range);
        while(steps(min, max, rangeExp) > 10){
            rangeExp++;
        }
        while(steps(min, max, rangeExp) < 10){
            rangeExp--;
        }
        return Math.min(rangeExp, log10Floor(min));
    }
     function generateTicks(generationOptions, { min , max  }) {
        min = finiteOrDefault(generationOptions.min, min);
        const ticks = [];
        const minExp = log10Floor(min);
        let exp = startExp(min, max);
        let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
        const stepSize = Math.pow(10, exp);
        const base = minExp > exp ? Math.pow(10, minExp) : 0;
        const start = Math.round((min - base) * precision) / precision;
        const offset = Math.floor((min - base) / stepSize / 10) * stepSize * 10;
        let significand = Math.floor((start - offset) / Math.pow(10, exp));
        let value = finiteOrDefault(generationOptions.min, Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision);
        while(value < max){
            ticks.push({
                value,
                major: isMajor(value),
                significand
            });
            if (significand >= 10) {
                significand = significand < 15 ? 15 : 20;
            } else {
                significand++;
            }
            if (significand >= 20) {
                exp++;
                significand = 2;
                precision = exp >= 0 ? 1 : precision;
            }
            value = Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision;
        }
        const lastTick = finiteOrDefault(generationOptions.max, value);
        ticks.push({
            value: lastTick,
            major: isMajor(lastTick),
            significand
        });
        return ticks;
    }
    class LogarithmicScale extends Scale {
        static id = 'logarithmic';
     static defaults = {
            ticks: {
                callback: Ticks.formatters.logarithmic,
                major: {
                    enabled: true
                }
            }
        };
        constructor(cfg){
            super(cfg);
             this.start = undefined;
             this.end = undefined;
             this._startValue = undefined;
            this._valueRange = 0;
        }
        parse(raw, index) {
            const value = LinearScaleBase.prototype.parse.apply(this, [
                raw,
                index
            ]);
            if (value === 0) {
                this._zero = true;
                return undefined;
            }
            return isNumberFinite(value) && value > 0 ? value : null;
        }
        determineDataLimits() {
            const { min , max  } = this.getMinMax(true);
            this.min = isNumberFinite(min) ? Math.max(0, min) : null;
            this.max = isNumberFinite(max) ? Math.max(0, max) : null;
            if (this.options.beginAtZero) {
                this._zero = true;
            }
            if (this._zero && this.min !== this._suggestedMin && !isNumberFinite(this._userMin)) {
                this.min = min === changeExponent(this.min, 0) ? changeExponent(this.min, -1) : changeExponent(this.min, 0);
            }
            this.handleTickRangeOptions();
        }
        handleTickRangeOptions() {
            const { minDefined , maxDefined  } = this.getUserBounds();
            let min = this.min;
            let max = this.max;
            const setMin = (v)=>min = minDefined ? min : v;
            const setMax = (v)=>max = maxDefined ? max : v;
            if (min === max) {
                if (min <= 0) {
                    setMin(1);
                    setMax(10);
                } else {
                    setMin(changeExponent(min, -1));
                    setMax(changeExponent(max, +1));
                }
            }
            if (min <= 0) {
                setMin(changeExponent(max, -1));
            }
            if (max <= 0) {
                setMax(changeExponent(min, +1));
            }
            this.min = min;
            this.max = max;
        }
        buildTicks() {
            const opts = this.options;
            const generationOptions = {
                min: this._userMin,
                max: this._userMax
            };
            const ticks = generateTicks(generationOptions, this);
            if (opts.bounds === 'ticks') {
                _setMinAndMaxByKey(ticks, this, 'value');
            }
            if (opts.reverse) {
                ticks.reverse();
                this.start = this.max;
                this.end = this.min;
            } else {
                this.start = this.min;
                this.end = this.max;
            }
            return ticks;
        }
     getLabelForValue(value) {
            return value === undefined ? '0' : formatNumber(value, this.chart.options.locale, this.options.ticks.format);
        }
     configure() {
            const start = this.min;
            super.configure();
            this._startValue = log10(start);
            this._valueRange = log10(this.max) - log10(start);
        }
        getPixelForValue(value) {
            if (value === undefined || value === 0) {
                value = this.min;
            }
            if (value === null || isNaN(value)) {
                return NaN;
            }
            return this.getPixelForDecimal(value === this.min ? 0 : (log10(value) - this._startValue) / this._valueRange);
        }
        getValueForPixel(pixel) {
            const decimal = this.getDecimalForPixel(pixel);
            return Math.pow(10, this._startValue + decimal * this._valueRange);
        }
    }

    function getTickBackdropHeight(opts) {
        const tickOpts = opts.ticks;
        if (tickOpts.display && opts.display) {
            const padding = toPadding(tickOpts.backdropPadding);
            return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
        }
        return 0;
    }
    function measureLabelSize(ctx, font, label) {
        label = isArray(label) ? label : [
            label
        ];
        return {
            w: _longestText(ctx, font.string, label),
            h: label.length * font.lineHeight
        };
    }
    function determineLimits(angle, pos, size, min, max) {
        if (angle === min || angle === max) {
            return {
                start: pos - size / 2,
                end: pos + size / 2
            };
        } else if (angle < min || angle > max) {
            return {
                start: pos - size,
                end: pos
            };
        }
        return {
            start: pos,
            end: pos + size
        };
    }
     function fitWithPointLabels(scale) {
        const orig = {
            l: scale.left + scale._padding.left,
            r: scale.right - scale._padding.right,
            t: scale.top + scale._padding.top,
            b: scale.bottom - scale._padding.bottom
        };
        const limits = Object.assign({}, orig);
        const labelSizes = [];
        const padding = [];
        const valueCount = scale._pointLabels.length;
        const pointLabelOpts = scale.options.pointLabels;
        const additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
        for(let i = 0; i < valueCount; i++){
            const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i));
            padding[i] = opts.padding;
            const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle);
            const plFont = toFont(opts.font);
            const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
            labelSizes[i] = textSize;
            const angleRadians = _normalizeAngle(scale.getIndexAngle(i) + additionalAngle);
            const angle = Math.round(toDegrees(angleRadians));
            const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
            const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
            updateLimits(limits, orig, angleRadians, hLimits, vLimits);
        }
        scale.setCenterPoint(orig.l - limits.l, limits.r - orig.r, orig.t - limits.t, limits.b - orig.b);
        scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
    }
    function updateLimits(limits, orig, angle, hLimits, vLimits) {
        const sin = Math.abs(Math.sin(angle));
        const cos = Math.abs(Math.cos(angle));
        let x = 0;
        let y = 0;
        if (hLimits.start < orig.l) {
            x = (orig.l - hLimits.start) / sin;
            limits.l = Math.min(limits.l, orig.l - x);
        } else if (hLimits.end > orig.r) {
            x = (hLimits.end - orig.r) / sin;
            limits.r = Math.max(limits.r, orig.r + x);
        }
        if (vLimits.start < orig.t) {
            y = (orig.t - vLimits.start) / cos;
            limits.t = Math.min(limits.t, orig.t - y);
        } else if (vLimits.end > orig.b) {
            y = (vLimits.end - orig.b) / cos;
            limits.b = Math.max(limits.b, orig.b + y);
        }
    }
    function createPointLabelItem(scale, index, itemOpts) {
        const outerDistance = scale.drawingArea;
        const { extra , additionalAngle , padding , size  } = itemOpts;
        const pointLabelPosition = scale.getPointPosition(index, outerDistance + extra + padding, additionalAngle);
        const angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
        const y = yForAngle(pointLabelPosition.y, size.h, angle);
        const textAlign = getTextAlignForAngle(angle);
        const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
        return {
            visible: true,
            x: pointLabelPosition.x,
            y,
            textAlign,
            left,
            top: y,
            right: left + size.w,
            bottom: y + size.h
        };
    }
    function isNotOverlapped(item, area) {
        if (!area) {
            return true;
        }
        const { left , top , right , bottom  } = item;
        const apexesInArea = _isPointInArea({
            x: left,
            y: top
        }, area) || _isPointInArea({
            x: left,
            y: bottom
        }, area) || _isPointInArea({
            x: right,
            y: top
        }, area) || _isPointInArea({
            x: right,
            y: bottom
        }, area);
        return !apexesInArea;
    }
    function buildPointLabelItems(scale, labelSizes, padding) {
        const items = [];
        const valueCount = scale._pointLabels.length;
        const opts = scale.options;
        const { centerPointLabels , display  } = opts.pointLabels;
        const itemOpts = {
            extra: getTickBackdropHeight(opts) / 2,
            additionalAngle: centerPointLabels ? PI / valueCount : 0
        };
        let area;
        for(let i = 0; i < valueCount; i++){
            itemOpts.padding = padding[i];
            itemOpts.size = labelSizes[i];
            const item = createPointLabelItem(scale, i, itemOpts);
            items.push(item);
            if (display === 'auto') {
                item.visible = isNotOverlapped(item, area);
                if (item.visible) {
                    area = item;
                }
            }
        }
        return items;
    }
    function getTextAlignForAngle(angle) {
        if (angle === 0 || angle === 180) {
            return 'center';
        } else if (angle < 180) {
            return 'left';
        }
        return 'right';
    }
    function leftForTextAlign(x, w, align) {
        if (align === 'right') {
            x -= w;
        } else if (align === 'center') {
            x -= w / 2;
        }
        return x;
    }
    function yForAngle(y, h, angle) {
        if (angle === 90 || angle === 270) {
            y -= h / 2;
        } else if (angle > 270 || angle < 90) {
            y -= h;
        }
        return y;
    }
    function drawPointLabelBox(ctx, opts, item) {
        const { left , top , right , bottom  } = item;
        const { backdropColor  } = opts;
        if (!isNullOrUndef(backdropColor)) {
            const borderRadius = toTRBLCorners(opts.borderRadius);
            const padding = toPadding(opts.backdropPadding);
            ctx.fillStyle = backdropColor;
            const backdropLeft = left - padding.left;
            const backdropTop = top - padding.top;
            const backdropWidth = right - left + padding.width;
            const backdropHeight = bottom - top + padding.height;
            if (Object.values(borderRadius).some((v)=>v !== 0)) {
                ctx.beginPath();
                addRoundedRectPath(ctx, {
                    x: backdropLeft,
                    y: backdropTop,
                    w: backdropWidth,
                    h: backdropHeight,
                    radius: borderRadius
                });
                ctx.fill();
            } else {
                ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
            }
        }
    }
    function drawPointLabels(scale, labelCount) {
        const { ctx , options: { pointLabels  }  } = scale;
        for(let i = labelCount - 1; i >= 0; i--){
            const item = scale._pointLabelItems[i];
            if (!item.visible) {
                continue;
            }
            const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
            drawPointLabelBox(ctx, optsAtIndex, item);
            const plFont = toFont(optsAtIndex.font);
            const { x , y , textAlign  } = item;
            renderText(ctx, scale._pointLabels[i], x, y + plFont.lineHeight / 2, plFont, {
                color: optsAtIndex.color,
                textAlign: textAlign,
                textBaseline: 'middle'
            });
        }
    }
    function pathRadiusLine(scale, radius, circular, labelCount) {
        const { ctx  } = scale;
        if (circular) {
            ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
        } else {
            let pointPosition = scale.getPointPosition(0, radius);
            ctx.moveTo(pointPosition.x, pointPosition.y);
            for(let i = 1; i < labelCount; i++){
                pointPosition = scale.getPointPosition(i, radius);
                ctx.lineTo(pointPosition.x, pointPosition.y);
            }
        }
    }
    function drawRadiusLine(scale, gridLineOpts, radius, labelCount, borderOpts) {
        const ctx = scale.ctx;
        const circular = gridLineOpts.circular;
        const { color , lineWidth  } = gridLineOpts;
        if (!circular && !labelCount || !color || !lineWidth || radius < 0) {
            return;
        }
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(borderOpts.dash);
        ctx.lineDashOffset = borderOpts.dashOffset;
        ctx.beginPath();
        pathRadiusLine(scale, radius, circular, labelCount);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    function createPointLabelContext(parent, index, label) {
        return createContext(parent, {
            label,
            index,
            type: 'pointLabel'
        });
    }
    class RadialLinearScale extends LinearScaleBase {
        static id = 'radialLinear';
     static defaults = {
            display: true,
            animate: true,
            position: 'chartArea',
            angleLines: {
                display: true,
                lineWidth: 1,
                borderDash: [],
                borderDashOffset: 0.0
            },
            grid: {
                circular: false
            },
            startAngle: 0,
            ticks: {
                showLabelBackdrop: true,
                callback: Ticks.formatters.numeric
            },
            pointLabels: {
                backdropColor: undefined,
                backdropPadding: 2,
                display: true,
                font: {
                    size: 10
                },
                callback (label) {
                    return label;
                },
                padding: 5,
                centerPointLabels: false
            }
        };
        static defaultRoutes = {
            'angleLines.color': 'borderColor',
            'pointLabels.color': 'color',
            'ticks.color': 'color'
        };
        static descriptors = {
            angleLines: {
                _fallback: 'grid'
            }
        };
        constructor(cfg){
            super(cfg);
             this.xCenter = undefined;
             this.yCenter = undefined;
             this.drawingArea = undefined;
             this._pointLabels = [];
            this._pointLabelItems = [];
        }
        setDimensions() {
            const padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
            const w = this.width = this.maxWidth - padding.width;
            const h = this.height = this.maxHeight - padding.height;
            this.xCenter = Math.floor(this.left + w / 2 + padding.left);
            this.yCenter = Math.floor(this.top + h / 2 + padding.top);
            this.drawingArea = Math.floor(Math.min(w, h) / 2);
        }
        determineDataLimits() {
            const { min , max  } = this.getMinMax(false);
            this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
            this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
            this.handleTickRangeOptions();
        }
     computeTickLimit() {
            return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
        }
        generateTickLabels(ticks) {
            LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
            this._pointLabels = this.getLabels().map((value, index)=>{
                const label = callback(this.options.pointLabels.callback, [
                    value,
                    index
                ], this);
                return label || label === 0 ? label : '';
            }).filter((v, i)=>this.chart.getDataVisibility(i));
        }
        fit() {
            const opts = this.options;
            if (opts.display && opts.pointLabels.display) {
                fitWithPointLabels(this);
            } else {
                this.setCenterPoint(0, 0, 0, 0);
            }
        }
        setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
            this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
            this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
            this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
        }
        getIndexAngle(index) {
            const angleMultiplier = TAU / (this._pointLabels.length || 1);
            const startAngle = this.options.startAngle || 0;
            return _normalizeAngle(index * angleMultiplier + toRadians(startAngle));
        }
        getDistanceFromCenterForValue(value) {
            if (isNullOrUndef(value)) {
                return NaN;
            }
            const scalingFactor = this.drawingArea / (this.max - this.min);
            if (this.options.reverse) {
                return (this.max - value) * scalingFactor;
            }
            return (value - this.min) * scalingFactor;
        }
        getValueForDistanceFromCenter(distance) {
            if (isNullOrUndef(distance)) {
                return NaN;
            }
            const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
            return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
        }
        getPointLabelContext(index) {
            const pointLabels = this._pointLabels || [];
            if (index >= 0 && index < pointLabels.length) {
                const pointLabel = pointLabels[index];
                return createPointLabelContext(this.getContext(), index, pointLabel);
            }
        }
        getPointPosition(index, distanceFromCenter, additionalAngle = 0) {
            const angle = this.getIndexAngle(index) - HALF_PI + additionalAngle;
            return {
                x: Math.cos(angle) * distanceFromCenter + this.xCenter,
                y: Math.sin(angle) * distanceFromCenter + this.yCenter,
                angle
            };
        }
        getPointPositionForValue(index, value) {
            return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
        }
        getBasePosition(index) {
            return this.getPointPositionForValue(index || 0, this.getBaseValue());
        }
        getPointLabelPosition(index) {
            const { left , top , right , bottom  } = this._pointLabelItems[index];
            return {
                left,
                top,
                right,
                bottom
            };
        }
     drawBackground() {
            const { backgroundColor , grid: { circular  }  } = this.options;
            if (backgroundColor) {
                const ctx = this.ctx;
                ctx.save();
                ctx.beginPath();
                pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
                ctx.closePath();
                ctx.fillStyle = backgroundColor;
                ctx.fill();
                ctx.restore();
            }
        }
     drawGrid() {
            const ctx = this.ctx;
            const opts = this.options;
            const { angleLines , grid , border  } = opts;
            const labelCount = this._pointLabels.length;
            let i, offset, position;
            if (opts.pointLabels.display) {
                drawPointLabels(this, labelCount);
            }
            if (grid.display) {
                this.ticks.forEach((tick, index)=>{
                    if (index !== 0 || index === 0 && this.min < 0) {
                        offset = this.getDistanceFromCenterForValue(tick.value);
                        const context = this.getContext(index);
                        const optsAtIndex = grid.setContext(context);
                        const optsAtIndexBorder = border.setContext(context);
                        drawRadiusLine(this, optsAtIndex, offset, labelCount, optsAtIndexBorder);
                    }
                });
            }
            if (angleLines.display) {
                ctx.save();
                for(i = labelCount - 1; i >= 0; i--){
                    const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
                    const { color , lineWidth  } = optsAtIndex;
                    if (!lineWidth || !color) {
                        continue;
                    }
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = color;
                    ctx.setLineDash(optsAtIndex.borderDash);
                    ctx.lineDashOffset = optsAtIndex.borderDashOffset;
                    offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max);
                    position = this.getPointPosition(i, offset);
                    ctx.beginPath();
                    ctx.moveTo(this.xCenter, this.yCenter);
                    ctx.lineTo(position.x, position.y);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }
     drawBorder() {}
     drawLabels() {
            const ctx = this.ctx;
            const opts = this.options;
            const tickOpts = opts.ticks;
            if (!tickOpts.display) {
                return;
            }
            const startAngle = this.getIndexAngle(0);
            let offset, width;
            ctx.save();
            ctx.translate(this.xCenter, this.yCenter);
            ctx.rotate(startAngle);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            this.ticks.forEach((tick, index)=>{
                if (index === 0 && this.min >= 0 && !opts.reverse) {
                    return;
                }
                const optsAtIndex = tickOpts.setContext(this.getContext(index));
                const tickFont = toFont(optsAtIndex.font);
                offset = this.getDistanceFromCenterForValue(this.ticks[index].value);
                if (optsAtIndex.showLabelBackdrop) {
                    ctx.font = tickFont.string;
                    width = ctx.measureText(tick.label).width;
                    ctx.fillStyle = optsAtIndex.backdropColor;
                    const padding = toPadding(optsAtIndex.backdropPadding);
                    ctx.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
                }
                renderText(ctx, tick.label, 0, -offset, tickFont, {
                    color: optsAtIndex.color,
                    strokeColor: optsAtIndex.textStrokeColor,
                    strokeWidth: optsAtIndex.textStrokeWidth
                });
            });
            ctx.restore();
        }
     drawTitle() {}
    }

    const INTERVALS = {
        millisecond: {
            common: true,
            size: 1,
            steps: 1000
        },
        second: {
            common: true,
            size: 1000,
            steps: 60
        },
        minute: {
            common: true,
            size: 60000,
            steps: 60
        },
        hour: {
            common: true,
            size: 3600000,
            steps: 24
        },
        day: {
            common: true,
            size: 86400000,
            steps: 30
        },
        week: {
            common: false,
            size: 604800000,
            steps: 4
        },
        month: {
            common: true,
            size: 2.628e9,
            steps: 12
        },
        quarter: {
            common: false,
            size: 7.884e9,
            steps: 4
        },
        year: {
            common: true,
            size: 3.154e10
        }
    };
     const UNITS =  /* #__PURE__ */ Object.keys(INTERVALS);
     function sorter(a, b) {
        return a - b;
    }
     function parse(scale, input) {
        if (isNullOrUndef(input)) {
            return null;
        }
        const adapter = scale._adapter;
        const { parser , round , isoWeekday  } = scale._parseOpts;
        let value = input;
        if (typeof parser === 'function') {
            value = parser(value);
        }
        if (!isNumberFinite(value)) {
            value = typeof parser === 'string' ? adapter.parse(value,  parser) : adapter.parse(value);
        }
        if (value === null) {
            return null;
        }
        if (round) {
            value = round === 'week' && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, 'isoWeek', isoWeekday) : adapter.startOf(value, round);
        }
        return +value;
    }
     function determineUnitForAutoTicks(minUnit, min, max, capacity) {
        const ilen = UNITS.length;
        for(let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i){
            const interval = INTERVALS[UNITS[i]];
            const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
            if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
                return UNITS[i];
            }
        }
        return UNITS[ilen - 1];
    }
     function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
        for(let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--){
            const unit = UNITS[i];
            if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
                return unit;
            }
        }
        return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
    }
     function determineMajorUnit(unit) {
        for(let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i){
            if (INTERVALS[UNITS[i]].common) {
                return UNITS[i];
            }
        }
    }
     function addTick(ticks, time, timestamps) {
        if (!timestamps) {
            ticks[time] = true;
        } else if (timestamps.length) {
            const { lo , hi  } = _lookup(timestamps, time);
            const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
            ticks[timestamp] = true;
        }
    }
     function setMajorTicks(scale, ticks, map, majorUnit) {
        const adapter = scale._adapter;
        const first = +adapter.startOf(ticks[0].value, majorUnit);
        const last = ticks[ticks.length - 1].value;
        let major, index;
        for(major = first; major <= last; major = +adapter.add(major, 1, majorUnit)){
            index = map[major];
            if (index >= 0) {
                ticks[index].major = true;
            }
        }
        return ticks;
    }
     function ticksFromTimestamps(scale, values, majorUnit) {
        const ticks = [];
         const map = {};
        const ilen = values.length;
        let i, value;
        for(i = 0; i < ilen; ++i){
            value = values[i];
            map[value] = i;
            ticks.push({
                value,
                major: false
            });
        }
        return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map, majorUnit);
    }
    class TimeScale extends Scale {
        static id = 'time';
     static defaults = {
     bounds: 'data',
            adapters: {},
            time: {
                parser: false,
                unit: false,
                round: false,
                isoWeekday: false,
                minUnit: 'millisecond',
                displayFormats: {}
            },
            ticks: {
     source: 'auto',
                callback: false,
                major: {
                    enabled: false
                }
            }
        };
     constructor(props){
            super(props);
             this._cache = {
                data: [],
                labels: [],
                all: []
            };
             this._unit = 'day';
             this._majorUnit = undefined;
            this._offsets = {};
            this._normalized = false;
            this._parseOpts = undefined;
        }
        init(scaleOpts, opts = {}) {
            const time = scaleOpts.time || (scaleOpts.time = {});
             const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
            adapter.init(opts);
            mergeIf(time.displayFormats, adapter.formats());
            this._parseOpts = {
                parser: time.parser,
                round: time.round,
                isoWeekday: time.isoWeekday
            };
            super.init(scaleOpts);
            this._normalized = opts.normalized;
        }
     parse(raw, index) {
            if (raw === undefined) {
                return null;
            }
            return parse(this, raw);
        }
        beforeLayout() {
            super.beforeLayout();
            this._cache = {
                data: [],
                labels: [],
                all: []
            };
        }
        determineDataLimits() {
            const options = this.options;
            const adapter = this._adapter;
            const unit = options.time.unit || 'day';
            let { min , max , minDefined , maxDefined  } = this.getUserBounds();
     function _applyBounds(bounds) {
                if (!minDefined && !isNaN(bounds.min)) {
                    min = Math.min(min, bounds.min);
                }
                if (!maxDefined && !isNaN(bounds.max)) {
                    max = Math.max(max, bounds.max);
                }
            }
            if (!minDefined || !maxDefined) {
                _applyBounds(this._getLabelBounds());
                if (options.bounds !== 'ticks' || options.ticks.source !== 'labels') {
                    _applyBounds(this.getMinMax(false));
                }
            }
            min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
            max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
            this.min = Math.min(min, max - 1);
            this.max = Math.max(min + 1, max);
        }
     _getLabelBounds() {
            const arr = this.getLabelTimestamps();
            let min = Number.POSITIVE_INFINITY;
            let max = Number.NEGATIVE_INFINITY;
            if (arr.length) {
                min = arr[0];
                max = arr[arr.length - 1];
            }
            return {
                min,
                max
            };
        }
     buildTicks() {
            const options = this.options;
            const timeOpts = options.time;
            const tickOpts = options.ticks;
            const timestamps = tickOpts.source === 'labels' ? this.getLabelTimestamps() : this._generate();
            if (options.bounds === 'ticks' && timestamps.length) {
                this.min = this._userMin || timestamps[0];
                this.max = this._userMax || timestamps[timestamps.length - 1];
            }
            const min = this.min;
            const max = this.max;
            const ticks = _filterBetween(timestamps, min, max);
            this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
            this._majorUnit = !tickOpts.major.enabled || this._unit === 'year' ? undefined : determineMajorUnit(this._unit);
            this.initOffsets(timestamps);
            if (options.reverse) {
                ticks.reverse();
            }
            return ticksFromTimestamps(this, ticks, this._majorUnit);
        }
        afterAutoSkip() {
            if (this.options.offsetAfterAutoskip) {
                this.initOffsets(this.ticks.map((tick)=>+tick.value));
            }
        }
     initOffsets(timestamps = []) {
            let start = 0;
            let end = 0;
            let first, last;
            if (this.options.offset && timestamps.length) {
                first = this.getDecimalForValue(timestamps[0]);
                if (timestamps.length === 1) {
                    start = 1 - first;
                } else {
                    start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
                }
                last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
                if (timestamps.length === 1) {
                    end = last;
                } else {
                    end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
                }
            }
            const limit = timestamps.length < 3 ? 0.5 : 0.25;
            start = _limitValue(start, 0, limit);
            end = _limitValue(end, 0, limit);
            this._offsets = {
                start,
                end,
                factor: 1 / (start + 1 + end)
            };
        }
     _generate() {
            const adapter = this._adapter;
            const min = this.min;
            const max = this.max;
            const options = this.options;
            const timeOpts = options.time;
            const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
            const stepSize = valueOrDefault(options.ticks.stepSize, 1);
            const weekday = minor === 'week' ? timeOpts.isoWeekday : false;
            const hasWeekday = isNumber(weekday) || weekday === true;
            const ticks = {};
            let first = min;
            let time, count;
            if (hasWeekday) {
                first = +adapter.startOf(first, 'isoWeek', weekday);
            }
            first = +adapter.startOf(first, hasWeekday ? 'day' : minor);
            if (adapter.diff(max, min, minor) > 100000 * stepSize) {
                throw new Error(min + ' and ' + max + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
            }
            const timestamps = options.ticks.source === 'data' && this.getDataTimestamps();
            for(time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++){
                addTick(ticks, time, timestamps);
            }
            if (time === max || options.bounds === 'ticks' || count === 1) {
                addTick(ticks, time, timestamps);
            }
            return Object.keys(ticks).sort(sorter).map((x)=>+x);
        }
     getLabelForValue(value) {
            const adapter = this._adapter;
            const timeOpts = this.options.time;
            if (timeOpts.tooltipFormat) {
                return adapter.format(value, timeOpts.tooltipFormat);
            }
            return adapter.format(value, timeOpts.displayFormats.datetime);
        }
     format(value, format) {
            const options = this.options;
            const formats = options.time.displayFormats;
            const unit = this._unit;
            const fmt = format || formats[unit];
            return this._adapter.format(value, fmt);
        }
     _tickFormatFunction(time, index, ticks, format) {
            const options = this.options;
            const formatter = options.ticks.callback;
            if (formatter) {
                return callback(formatter, [
                    time,
                    index,
                    ticks
                ], this);
            }
            const formats = options.time.displayFormats;
            const unit = this._unit;
            const majorUnit = this._majorUnit;
            const minorFormat = unit && formats[unit];
            const majorFormat = majorUnit && formats[majorUnit];
            const tick = ticks[index];
            const major = majorUnit && majorFormat && tick && tick.major;
            return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
        }
     generateTickLabels(ticks) {
            let i, ilen, tick;
            for(i = 0, ilen = ticks.length; i < ilen; ++i){
                tick = ticks[i];
                tick.label = this._tickFormatFunction(tick.value, i, ticks);
            }
        }
     getDecimalForValue(value) {
            return value === null ? NaN : (value - this.min) / (this.max - this.min);
        }
     getPixelForValue(value) {
            const offsets = this._offsets;
            const pos = this.getDecimalForValue(value);
            return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
        }
     getValueForPixel(pixel) {
            const offsets = this._offsets;
            const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
            return this.min + pos * (this.max - this.min);
        }
     _getLabelSize(label) {
            const ticksOpts = this.options.ticks;
            const tickLabelWidth = this.ctx.measureText(label).width;
            const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
            const cosRotation = Math.cos(angle);
            const sinRotation = Math.sin(angle);
            const tickFontSize = this._resolveTickFontOptions(0).size;
            return {
                w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
                h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
            };
        }
     _getLabelCapacity(exampleTime) {
            const timeOpts = this.options.time;
            const displayFormats = timeOpts.displayFormats;
            const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
            const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [
                exampleTime
            ], this._majorUnit), format);
            const size = this._getLabelSize(exampleLabel);
            const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
            return capacity > 0 ? capacity : 1;
        }
     getDataTimestamps() {
            let timestamps = this._cache.data || [];
            let i, ilen;
            if (timestamps.length) {
                return timestamps;
            }
            const metas = this.getMatchingVisibleMetas();
            if (this._normalized && metas.length) {
                return this._cache.data = metas[0].controller.getAllParsedValues(this);
            }
            for(i = 0, ilen = metas.length; i < ilen; ++i){
                timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
            }
            return this._cache.data = this.normalize(timestamps);
        }
     getLabelTimestamps() {
            const timestamps = this._cache.labels || [];
            let i, ilen;
            if (timestamps.length) {
                return timestamps;
            }
            const labels = this.getLabels();
            for(i = 0, ilen = labels.length; i < ilen; ++i){
                timestamps.push(parse(this, labels[i]));
            }
            return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
        }
     normalize(values) {
            return _arrayUnique(values.sort(sorter));
        }
    }

    function interpolate(table, val, reverse) {
        let lo = 0;
        let hi = table.length - 1;
        let prevSource, nextSource, prevTarget, nextTarget;
        if (reverse) {
            if (val >= table[lo].pos && val <= table[hi].pos) {
                ({ lo , hi  } = _lookupByKey(table, 'pos', val));
            }
            ({ pos: prevSource , time: prevTarget  } = table[lo]);
            ({ pos: nextSource , time: nextTarget  } = table[hi]);
        } else {
            if (val >= table[lo].time && val <= table[hi].time) {
                ({ lo , hi  } = _lookupByKey(table, 'time', val));
            }
            ({ time: prevSource , pos: prevTarget  } = table[lo]);
            ({ time: nextSource , pos: nextTarget  } = table[hi]);
        }
        const span = nextSource - prevSource;
        return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
    }
    class TimeSeriesScale extends TimeScale {
        static id = 'timeseries';
     static defaults = TimeScale.defaults;
     constructor(props){
            super(props);
             this._table = [];
             this._minPos = undefined;
             this._tableRange = undefined;
        }
     initOffsets() {
            const timestamps = this._getTimestampsForTable();
            const table = this._table = this.buildLookupTable(timestamps);
            this._minPos = interpolate(table, this.min);
            this._tableRange = interpolate(table, this.max) - this._minPos;
            super.initOffsets(timestamps);
        }
     buildLookupTable(timestamps) {
            const { min , max  } = this;
            const items = [];
            const table = [];
            let i, ilen, prev, curr, next;
            for(i = 0, ilen = timestamps.length; i < ilen; ++i){
                curr = timestamps[i];
                if (curr >= min && curr <= max) {
                    items.push(curr);
                }
            }
            if (items.length < 2) {
                return [
                    {
                        time: min,
                        pos: 0
                    },
                    {
                        time: max,
                        pos: 1
                    }
                ];
            }
            for(i = 0, ilen = items.length; i < ilen; ++i){
                next = items[i + 1];
                prev = items[i - 1];
                curr = items[i];
                if (Math.round((next + prev) / 2) !== curr) {
                    table.push({
                        time: curr,
                        pos: i / (ilen - 1)
                    });
                }
            }
            return table;
        }
     _generate() {
            const min = this.min;
            const max = this.max;
            let timestamps = super.getDataTimestamps();
            if (!timestamps.includes(min) || !timestamps.length) {
                timestamps.splice(0, 0, min);
            }
            if (!timestamps.includes(max) || timestamps.length === 1) {
                timestamps.push(max);
            }
            return timestamps.sort((a, b)=>a - b);
        }
     _getTimestampsForTable() {
            let timestamps = this._cache.all || [];
            if (timestamps.length) {
                return timestamps;
            }
            const data = this.getDataTimestamps();
            const label = this.getLabelTimestamps();
            if (data.length && label.length) {
                timestamps = this.normalize(data.concat(label));
            } else {
                timestamps = data.length ? data : label;
            }
            timestamps = this._cache.all = timestamps;
            return timestamps;
        }
     getDecimalForValue(value) {
            return (interpolate(this._table, value) - this._minPos) / this._tableRange;
        }
     getValueForPixel(pixel) {
            const offsets = this._offsets;
            const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
            return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
        }
    }

    var scales = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CategoryScale: CategoryScale,
    LinearScale: LinearScale,
    LogarithmicScale: LogarithmicScale,
    RadialLinearScale: RadialLinearScale,
    TimeScale: TimeScale,
    TimeSeriesScale: TimeSeriesScale
    });

    const registerables = [
        controllers,
        elements,
        plugins,
        scales
    ];

    Chart.register(...registerables);

    /* src\routes\home.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$4 = "src\\routes\\home.svelte";

    // (441:6) {:else}
    function create_else_block_1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*displayDSCOVRSatellite*/ ctx[1] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*displayDSCOVRSatellite*/ ctx[1]) {
    				if (if_block) {
    					if (dirty & /*displayDSCOVRSatellite*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(441:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (439:6) {#if displayACESatellite}
    function create_if_block_1$1(ctx) {
    	let ace_sat;
    	let current;
    	ace_sat = new Ace_sat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ace_sat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ace_sat, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ace_sat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ace_sat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ace_sat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(439:6) {#if displayACESatellite}",
    		ctx
    	});

    	return block;
    }

    // (443:8) {#if displayDSCOVRSatellite}
    function create_if_block_2(ctx) {
    	let dis_sat;
    	let current;
    	dis_sat = new Dis_sat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dis_sat.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dis_sat, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dis_sat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dis_sat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dis_sat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(443:8) {#if displayDSCOVRSatellite}",
    		ctx
    	});

    	return block;
    }

    // (463:8) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No Magnetic Reconnection Detected.";
    			attr_dev(p, "class", "bullet-point-green svelte-1dtv40p");
    			add_location(p, file$4, 463, 10, 12669);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(463:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (461:8) {#if magneticReconnection}
    function create_if_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Magnetic Reconnection Detected!";
    			attr_dev(p, "class", "bullet-point");
    			add_location(p, file$4, 461, 10, 12583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(461:8) {#if magneticReconnection}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let div6;
    	let div2;
    	let current_block_type_index;
    	let if_block0;
    	let t4;
    	let section;
    	let div3;
    	let h20;
    	let t6;
    	let canvas0;
    	let t7;
    	let div4;
    	let h21;
    	let t9;
    	let canvas1;
    	let t10;
    	let div5;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*displayACESatellite*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*magneticReconnection*/ ctx[2]) return create_if_block$2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "ACE Satellite";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "DSCOVR Satellite";
    			t3 = space();
    			div6 = element("div");
    			div2 = element("div");
    			if_block0.c();
    			t4 = space();
    			section = element("section");
    			div3 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Geo-magnet";
    			t6 = space();
    			canvas0 = element("canvas");
    			t7 = space();
    			div4 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Solar wind";
    			t9 = space();
    			canvas1 = element("canvas");
    			t10 = space();
    			div5 = element("div");
    			if_block1.c();
    			attr_dev(button0, "class", "text-xs p-3 svelte-1dtv40p");
    			add_location(button0, file$4, 426, 6, 11492);
    			attr_dev(button1, "class", "text-xs p-3 svelte-1dtv40p");
    			add_location(button1, file$4, 429, 6, 11593);
    			add_location(div0, file$4, 425, 4, 11480);
    			attr_dev(div1, "class", "navbar svelte-1dtv40p");
    			add_location(div1, file$4, 424, 2, 11455);
    			attr_dev(div2, "class", "w-full h-full flex col-span-8 mt-16");
    			add_location(div2, file$4, 437, 4, 11820);
    			add_location(h20, file$4, 451, 8, 12256);
    			attr_dev(canvas0, "id", "earthChart");
    			attr_dev(canvas0, "width", "400");
    			attr_dev(canvas0, "height", "200");
    			add_location(canvas0, file$4, 452, 8, 12284);
    			attr_dev(div3, "class", "border h-fit p-2 w-full");
    			add_location(div3, file$4, 450, 6, 12210);
    			add_location(h21, file$4, 455, 8, 12401);
    			attr_dev(canvas1, "id", "solarWindChart");
    			attr_dev(canvas1, "width", "400");
    			attr_dev(canvas1, "height", "200");
    			add_location(canvas1, file$4, 456, 8, 12429);
    			attr_dev(div4, "class", "border p-2 h-fit w-full");
    			add_location(div4, file$4, 454, 6, 12355);
    			attr_dev(div5, "class", "relative bottom-10");
    			add_location(div5, file$4, 459, 6, 12505);
    			attr_dev(section, "class", "w-full col-span-4 h-full space-y-10");
    			add_location(section, file$4, 449, 4, 12150);
    			attr_dev(div6, "class", "grid grid-cols-12 gap-x-10");
    			add_location(div6, file$4, 436, 2, 11775);
    			attr_dev(main, "class", "");
    			add_location(main, file$4, 423, 0, 11437);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(main, t3);
    			append_dev(main, div6);
    			append_dev(div6, div2);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div6, t4);
    			append_dev(div6, section);
    			append_dev(section, div3);
    			append_dev(div3, h20);
    			append_dev(div3, t6);
    			append_dev(div3, canvas0);
    			append_dev(section, t7);
    			append_dev(section, div4);
    			append_dev(div4, h21);
    			append_dev(div4, t9);
    			append_dev(div4, canvas1);
    			append_dev(section, t10);
    			append_dev(section, div5);
    			if_block1.m(div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*showACESatellite*/ ctx[3], false, false, false, false),
    					listen_dev(button1, "click", /*showDSCOVRSatellite*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div2, null);
    			}

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div5, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const apiKey$1 = "1202a311-b72c-4c0c-87fb-48cd908723c1";
    const apiBaseUrl = "https://app-rssi-api-eastus-dev-001.azurewebsites.net";

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const earthDataApiUrl = apiBaseUrl + "/api/earthdata/ncei";
    	const solarWindDataApiUrl = apiBaseUrl + "/api/satellitedata/dscovr";

    	// Define the API endpoint for posting tweets
    	const tweetApiUrl = apiBaseUrl + "/api/tweets";

    	// Store recoonection event info to DB
    	const dbFeedbackUrl = apiBaseUrl + "/api/BtRegression/feedback";

    	let displayACESatellite = false;
    	let displayDSCOVRSatellite = false;

    	function showACESatellite() {
    		$$invalidate(0, displayACESatellite = true);
    		$$invalidate(1, displayDSCOVRSatellite = false);
    	}

    	function showDSCOVRSatellite() {
    		$$invalidate(0, displayACESatellite = false);
    		$$invalidate(1, displayDSCOVRSatellite = true);
    	}

    	let magneticReconnection = false;
    	let earthChart;
    	let solarWindChart;

    	// Initialize Earth data as an empty object
    	let earthData = {};

    	// Initialize Sun data as an empty object
    	let solarWindData = {};

    	// Convert the Earth and Sun data objects into arrays for chart data
    	let earthDataLabels = [];

    	let earthDataValues = [];
    	let solarWindDataLabels = [];
    	let solarWindDataValues = [];

    	// Chart data for Earth and solar wind
    	let earthChartData = {
    		labels: earthDataLabels,
    		datasets: [
    			{
    				label: "Vertical",
    				data: earthDataValues[0],
    				borderColor: "rgba(75, 192, 192, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "Latitude",
    				data: earthDataValues[1],
    				borderColor: "rgba(255, 99, 132, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "Longitude",
    				data: earthDataValues[2],
    				borderColor: "rgba(255, 99, 132, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "Altitude",
    				data: earthDataValues[3],
    				borderColor: "rgba(255, 206, 86, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "Intensity",
    				data: earthDataValues[4],
    				borderColor: "rgba(54, 162, 235, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "Declination",
    				data: earthDataValues[5],
    				borderColor: "rgba(153, 102, 255, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "Inclination",
    				data: earthDataValues[6],
    				borderColor: "rgba(255, 159, 64, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "North",
    				data: earthDataValues[7],
    				borderColor: "rgba(255, 99, 71, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "East",
    				data: earthDataValues[8],
    				borderColor: "rgba(75, 192, 192, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "Horizontal",
    				data: earthDataValues[9],
    				borderColor: "rgba(255, 206, 86, 1)",
    				borderWidth: 2,
    				fill: false
    			}
    		]
    	};

    	let solarWindChartData = {
    		labels: solarWindDataLabels,
    		datasets: [
    			{
    				label: "bt",
    				data: solarWindDataValues[0],
    				borderColor: "rgba(54, 162, 235, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "bzGSM",
    				data: solarWindDataValues[1],
    				borderColor: "rgba(255, 206, 86, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "byGSM",
    				data: solarWindDataValues[2],
    				borderColor: "rgba(75, 192, 192, 1)",
    				borderWidth: 2,
    				fill: false
    			},
    			{
    				label: "bxGSM",
    				data: solarWindDataValues[3],
    				borderColor: "rgba(255, 99, 132, 1)",
    				borderWidth: 2,
    				fill: false
    			}
    		]
    	};

    	// Function to check for magnetic reconnection
    	function checkMagneticReconnection() {
    		const Vertical = earthData.Vertical;
    		const BzGsm = solarWindData.bzGSM;

    		if (Vertical === BzGsm && BzGsm < 0) {
    			// Magnetic reconnection detected
    			return true;
    		} else {
    			return false;
    		}
    	}

    	async function magneticReconnectionDetectionTweet() {
    		var msg = "Magnetic reconnection detected!";
    		msg += "\n@SpaceApps @NASASocial @NASAEarth";

    		// Create the request body
    		const requestBody = { text: msg };

    		try {
    			const response = await fetch(tweetApiUrl, {
    				method: "POST",
    				headers: {
    					"x-api-key": `${apiKey$1}`,
    					"Content-Type": "application/json"
    				},
    				body: JSON.stringify(requestBody)
    			});

    			if (response.ok) {
    				// Successfully posted the tweet
    				console.log("Tweet posted successfully.");
    			} else {
    				// Handle any errors during the POST request
    				console.error("Failed to post the tweet.");
    			}
    		} catch(error) {
    			// Handle network or fetch errors
    			console.error("Error while posting the tweet:", error);
    		}
    	}

    	async function saveReconnectionOccurence() {
    		var date = new Date();

    		const requestBody = {
    			bxGSM: solarWindData.bxGSM,
    			byGSM: solarWindData.byGSM,
    			bzGSM: solarWindData.bzGSM,
    			bt: solarWindData.bt,
    			intensity: earthData.intensity,
    			declination: earthData.declination,
    			inclination: earthData.inclination,
    			north: earthData.north,
    			east: earthData.east,
    			vertical: earthData.vertical,
    			horizontal: earthData.horizontal,
    			year: date.getFullYear(),
    			month: date.getMonth() + 1
    		};

    		try {
    			const response = await fetch(dbFeedbackUrl, {
    				method: "POST",
    				headers: {
    					"x-api-key": `${apiKey$1}`,
    					"Content-Type": "application/json"
    				},
    				body: JSON.stringify(requestBody)
    			});

    			if (response.ok) {
    				// Successfully posted the tweet
    				console.log("Saved to DB successfully.");
    			} else {
    				// Handle any errors during the POST request
    				console.error("Failed saving to DB!");
    			}
    		} catch(error) {
    			// Handle network or fetch errors
    			console.error("Error while saving to DB :", error);
    		}
    	}

    	function updateEarthChart(labels, values) {
    		earthChart.data.labels = labels;
    		earthChart.data.datasets[0].data = values;
    		earthChart.update();
    	}

    	function updateSolarWindChart(labels, values) {
    		solarWindChart.data.labels = labels;
    		solarWindChart.data.datasets[0].data = values;
    		solarWindChart.update();
    	}

    	async function fetchEarthData() {
    		// Fetch Earth data
    		try {
    			const earthResponse = await fetch(earthDataApiUrl, {
    				headers: {
    					"x-api-key": `${apiKey$1}`,
    					"content-type": "application/json"
    				}
    			});

    			if (earthResponse.ok) {
    				earthData = await earthResponse.json();

    				if (earthDataLabels.length < 10) {
    					earthDataLabels.push("Vertical");
    					earthDataLabels.push("Latitude");
    					earthDataLabels.push("Longitude");
    					earthDataLabels.push("Altitude");
    					earthDataLabels.push("Intensity");
    					earthDataLabels.push("Declination");
    					earthDataLabels.push("Inclination");
    					earthDataLabels.push("North");
    					earthDataLabels.push("East");
    					earthDataLabels.push("Horizontal");
    				}

    				earthDataValues.push(earthData.vertical);
    				earthDataValues.push(earthData.latitude);
    				earthDataValues.push(earthData.longitude);
    				earthDataValues.push(earthData.altitude);
    				earthDataValues.push(earthData.intensity);
    				earthDataValues.push(earthData.declination);
    				earthDataValues.push(earthData.inclination);
    				earthDataValues.push(earthData.north);
    				earthDataValues.push(earthData.east);
    				earthDataValues.push(earthData.horizontal);

    				// Update the Earth chart with new data
    				updateEarthChart(earthDataLabels, earthDataValues);

    				earthDataValues = [];
    			} else {
    				console.error("Failed to fetch Earth data from the API."); // console.log(earthData);
    			}
    		} catch(error) {
    			console.error("Error while fetching Earth data:", error);
    		}
    	}

    	async function fetchSolarWindData() {
    		// Fetch Solar wind data
    		try {
    			const solarWindResponse = await fetch(solarWindDataApiUrl, {
    				headers: {
    					"x-api-key": `${apiKey$1}`,
    					"Content-Type": "application/json"
    				}
    			});

    			if (solarWindResponse.ok) {
    				solarWindData = await solarWindResponse.json();

    				if (solarWindDataLabels.length < 4) {
    					solarWindDataLabels.push("bt");
    					solarWindDataLabels.push("bzGSM");
    					solarWindDataLabels.push("byGSM");
    					solarWindDataLabels.push("bxGSM");
    				}

    				solarWindDataValues.push(solarWindData.bt);
    				solarWindDataValues.push(solarWindData.bzGSM);
    				solarWindDataValues.push(solarWindData.byGSM);
    				solarWindDataValues.push(solarWindData.bxGSM);

    				// Update the Sun chart with new data
    				updateSolarWindChart(solarWindDataLabels, solarWindDataValues);

    				solarWindDataValues = [];
    			} else {
    				console.error("Failed to fetch solar wind data from the API."); // console.log(solarWindData);
    			}
    		} catch(error) {
    			console.error("Error while fetching solar wind data:", error);
    		}
    	}

    	async function lifeCycleEvent() {
    		// Fetch data
    		await fetchEarthData();

    		await fetchSolarWindData();

    		// Check reconnection
    		$$invalidate(2, magneticReconnection = checkMagneticReconnection());
    	} // await magneticReconnectionDetectionTweet();

    	onMount(async () => {
    		await lifeCycleEvent();

    		// Fetch new data at 10s interval
    		setInterval(lifeCycleEvent, 10000);
    	});

    	// Initialize solar wind chart
    	onMount(() => {
    		const solarWindCanvas = document.getElementById("solarWindChart");

    		solarWindChart = new Chart(solarWindCanvas,
    		{
    				type: "line",
    				data: solarWindChartData,
    				options: {
    					scales: {
    						x: {
    							display: true, // Display the X-axis
    							
    						},
    						y: { beginAtZero: true }
    					},
    					plugins: {
    						title: { display: true, text: "Solar Wind Data" },
    						legend: { display: false }
    					}
    				}
    			});

    		const earthCanvas = document.getElementById("earthChart");

    		earthChart = new Chart(earthCanvas,
    		{
    				type: "line",
    				data: earthChartData,
    				options: {
    					scales: {
    						x: {
    							display: true, // Display the X-axis
    							
    						},
    						y: {
    							beginAtZero: true,
    							display: true, // Display the Y-axis
    							
    						}
    					},
    					plugins: {
    						title: { display: true, text: "Geo-magnetic Data" },
    						legend: { display: false }
    					}
    				}
    			});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Ace_Sat: Ace_sat,
    		Dis_Sat: Dis_sat,
    		onMount,
    		Chart,
    		apiKey: apiKey$1,
    		apiBaseUrl,
    		earthDataApiUrl,
    		solarWindDataApiUrl,
    		tweetApiUrl,
    		dbFeedbackUrl,
    		displayACESatellite,
    		displayDSCOVRSatellite,
    		showACESatellite,
    		showDSCOVRSatellite,
    		magneticReconnection,
    		earthChart,
    		solarWindChart,
    		earthData,
    		solarWindData,
    		earthDataLabels,
    		earthDataValues,
    		solarWindDataLabels,
    		solarWindDataValues,
    		earthChartData,
    		solarWindChartData,
    		checkMagneticReconnection,
    		magneticReconnectionDetectionTweet,
    		saveReconnectionOccurence,
    		updateEarthChart,
    		updateSolarWindChart,
    		fetchEarthData,
    		fetchSolarWindData,
    		lifeCycleEvent
    	});

    	$$self.$inject_state = $$props => {
    		if ('displayACESatellite' in $$props) $$invalidate(0, displayACESatellite = $$props.displayACESatellite);
    		if ('displayDSCOVRSatellite' in $$props) $$invalidate(1, displayDSCOVRSatellite = $$props.displayDSCOVRSatellite);
    		if ('magneticReconnection' in $$props) $$invalidate(2, magneticReconnection = $$props.magneticReconnection);
    		if ('earthChart' in $$props) earthChart = $$props.earthChart;
    		if ('solarWindChart' in $$props) solarWindChart = $$props.solarWindChart;
    		if ('earthData' in $$props) earthData = $$props.earthData;
    		if ('solarWindData' in $$props) solarWindData = $$props.solarWindData;
    		if ('earthDataLabels' in $$props) earthDataLabels = $$props.earthDataLabels;
    		if ('earthDataValues' in $$props) earthDataValues = $$props.earthDataValues;
    		if ('solarWindDataLabels' in $$props) solarWindDataLabels = $$props.solarWindDataLabels;
    		if ('solarWindDataValues' in $$props) solarWindDataValues = $$props.solarWindDataValues;
    		if ('earthChartData' in $$props) earthChartData = $$props.earthChartData;
    		if ('solarWindChartData' in $$props) solarWindChartData = $$props.solarWindChartData;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		displayACESatellite,
    		displayDSCOVRSatellite,
    		magneticReconnection,
    		showACESatellite,
    		showDSCOVRSatellite
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\routes\analytics.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$3 = "src\\routes\\analytics.svelte";

    // (221:12) {#if !vector.bt_pred}
    function create_if_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Fetching...";
    			attr_dev(p, "class", "text-sm");
    			add_location(p, file$3, 221, 14, 6325);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(221:12) {#if !vector.bt_pred}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let section;
    	let div4;
    	let div3;
    	let div0;
    	let h10;
    	let t1;
    	let div2;
    	let div1;
    	let h3;
    	let svg;
    	let path;
    	let t2;
    	let t3;
    	let h40;
    	let t6;
    	let h41;
    	let t9;
    	let h42;
    	let t12;
    	let h11;
    	let t14;
    	let div9;
    	let div8;
    	let h12;
    	let t16;
    	let div7;
    	let div6;
    	let t17;
    	let div5;
    	let button0;
    	let h13;
    	let t19;
    	let h14;
    	let t20_value = /*vector*/ ctx[0].bx_pred.toFixed(2) + "";
    	let t20;
    	let t21;
    	let button1;
    	let h15;
    	let t23;
    	let h16;
    	let t24_value = /*vector*/ ctx[0].by_pred.toFixed(2) + "";
    	let t24;
    	let t25;
    	let button2;
    	let h17;
    	let t27;
    	let h18;
    	let t28_value = /*vector*/ ctx[0].bz_pred.toFixed(2) + "";
    	let t28;
    	let t29;
    	let button3;
    	let h19;
    	let t31;
    	let h110;
    	let t32_value = /*vector*/ ctx[0].bt_pred.toFixed(2) + "";
    	let t32;
    	let t33;
    	let p;
    	let t34;
    	let a;
    	let t36;
    	let h111;
    	let if_block = !/*vector*/ ctx[0].bt_pred && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			section = element("section");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "section 001";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t2 = text("\n\n              Reconnection freq");
    			t3 = space();
    			h40 = element("h4");
    			h40.textContent = `Over The Day: ${/*reconFreqDay*/ ctx[1]}`;
    			t6 = space();
    			h41 = element("h4");
    			h41.textContent = `Over The Week: ${/*reconFreqWeek*/ ctx[3]}`;
    			t9 = space();
    			h42 = element("h4");
    			h42.textContent = `Over The Month: ${/*reconFreqMonth*/ ctx[2]}`;
    			t12 = space();
    			h11 = element("h1");
    			h11.textContent = "AI assisted analytics";
    			t14 = space();
    			div9 = element("div");
    			div8 = element("div");
    			h12 = element("h1");
    			h12.textContent = "section 002";
    			t16 = space();
    			div7 = element("div");
    			div6 = element("div");
    			if (if_block) if_block.c();
    			t17 = space();
    			div5 = element("div");
    			button0 = element("button");
    			h13 = element("h1");
    			h13.textContent = "Bx";
    			t19 = space();
    			h14 = element("h1");
    			t20 = text(t20_value);
    			t21 = space();
    			button1 = element("button");
    			h15 = element("h1");
    			h15.textContent = "By";
    			t23 = space();
    			h16 = element("h1");
    			t24 = text(t24_value);
    			t25 = space();
    			button2 = element("button");
    			h17 = element("h1");
    			h17.textContent = "Bz";
    			t27 = space();
    			h18 = element("h1");
    			t28 = text(t28_value);
    			t29 = space();
    			button3 = element("button");
    			h19 = element("h1");
    			h19.textContent = "Bt";
    			t31 = space();
    			h110 = element("h1");
    			t32 = text(t32_value);
    			t33 = space();
    			p = element("p");
    			t34 = text("Powered by ");
    			a = element("a");
    			a.textContent = "ML.NET";
    			t36 = space();
    			h111 = element("h1");
    			h111.textContent = "Most vulnerable conditions";
    			set_style(h10, "font-family", "'Jura', sans-serif");
    			set_style(h10, "writing-mode", "vertical-rl");
    			attr_dev(h10, "class", "uppercase text-xs text-sideways");
    			add_location(h10, file$3, 147, 10, 3945);
    			add_location(div0, file$3, 146, 8, 3929);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");
    			add_location(path, file$3, 175, 16, 4963);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-4 h-4");
    			add_location(svg, file$3, 167, 14, 4706);
    			attr_dev(h3, "class", "flex bg-[#132e27] w-fit p-2 rounded-md items-center text-sm uppercase space-x-2 tracking-wide border border-[#1df2f0]");
    			set_style(h3, "box-shadow", "0px 5px 10px -5px rgb(0, 255, 213)");
    			add_location(h3, file$3, 163, 12, 4463);
    			attr_dev(h40, "class", "bullet-point svelte-1d674uq");
    			add_location(h40, file$3, 185, 12, 5227);
    			attr_dev(h41, "class", "bullet-point svelte-1d674uq");
    			add_location(h41, file$3, 188, 12, 5327);
    			attr_dev(h42, "class", "bullet-point svelte-1d674uq");
    			add_location(h42, file$3, 191, 12, 5428);
    			attr_dev(div1, "class", "p-3 w-full space-y-3");
    			set_style(div1, "background", "linear-gradient( -135deg, transparent 20px, #161E1C 0)");
    			add_location(div1, file$3, 159, 10, 4304);
    			attr_dev(div2, "class", "p-[1px] w-full");
    			set_style(div2, "background", "linear-gradient( -135deg, transparent 20px, #ffffff4d 0)");
    			add_location(div2, file$3, 155, 8, 4157);
    			attr_dev(div3, "class", "flex items-start w-full");
    			add_location(div3, file$3, 145, 6, 3883);
    			attr_dev(h11, "class", "title text-xl ml-4 border border-[#b3c7c2]/20 shadow-xl bg-[#132e27] w-fit p-2 mt-2 uppercase");
    			add_location(h11, file$3, 197, 6, 5570);
    			attr_dev(div4, "class", "w-full");
    			add_location(div4, file$3, 144, 4, 3856);
    			set_style(h12, "font-family", "'Jura', sans-serif");
    			set_style(h12, "writing-mode", "vertical-rl");
    			attr_dev(h12, "class", "uppercase text-xs text-sideways");
    			add_location(h12, file$3, 206, 8, 5804);
    			attr_dev(h13, "class", "text-xs flex justify-start px-5");
    			add_location(h13, file$3, 226, 16, 6484);
    			attr_dev(h14, "class", "text-xl relative -top-2");
    			add_location(h14, file$3, 227, 16, 6552);
    			attr_dev(button0, "class", "w-full p-[1px] svelte-1d674uq");
    			add_location(button0, file$3, 225, 14, 6434);
    			attr_dev(h15, "class", "text-xs flex justify-start px-5");
    			add_location(h15, file$3, 232, 16, 6737);
    			attr_dev(h16, "class", "text-xl relative -top-2");
    			add_location(h16, file$3, 233, 16, 6805);
    			attr_dev(button1, "class", "w-full svelte-1d674uq");
    			add_location(button1, file$3, 231, 14, 6695);
    			attr_dev(h17, "class", "text-xs flex justify-start px-5");
    			add_location(h17, file$3, 238, 16, 6990);
    			attr_dev(h18, "class", "text-xl relative -top-2");
    			add_location(h18, file$3, 239, 16, 7058);
    			attr_dev(button2, "class", "w-full svelte-1d674uq");
    			add_location(button2, file$3, 237, 14, 6948);
    			attr_dev(h19, "class", "text-xs flex justify-start px-5");
    			add_location(h19, file$3, 244, 16, 7243);
    			attr_dev(h110, "class", "text-xl relative -top-2");
    			add_location(h110, file$3, 245, 16, 7311);
    			attr_dev(button3, "class", "w-full svelte-1d674uq");
    			add_location(button3, file$3, 243, 14, 7201);
    			attr_dev(div5, "class", "space-x-5 flex");
    			add_location(div5, file$3, 224, 12, 6391);
    			attr_dev(a, "href", "https://dotnet.microsoft.com/en-us/apps/machinelearning-ai");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1d674uq");
    			add_location(a, file$3, 251, 25, 7531);
    			attr_dev(p, "class", "relative top-5 text-xs");
    			add_location(p, file$3, 250, 12, 7471);
    			attr_dev(div6, "class", "grid w-full p-7");
    			set_style(div6, "background", "linear-gradient( -135deg, transparent 20px, #161E1C 0)");
    			add_location(div6, file$3, 216, 10, 6136);
    			attr_dev(div7, "class", "w-full p-[1px]");
    			set_style(div7, "background", "linear-gradient( -135deg, transparent 20px, #ffffff4d 0)");
    			add_location(div7, file$3, 212, 8, 5990);
    			attr_dev(div8, "class", "flex");
    			add_location(div8, file$3, 205, 6, 5777);
    			attr_dev(h111, "class", "title text-xl ml-4 border border-[#b3c7c2]/20 shadow-xl bg-[#132e27] w-fit p-2 mt-2 uppercase");
    			add_location(h111, file$3, 261, 6, 7774);
    			attr_dev(div9, "class", "w-full");
    			add_location(div9, file$3, 204, 4, 5750);
    			attr_dev(section, "class", "flex items-start mt-5 w-full justify-between space-x-5");
    			add_location(section, file$3, 143, 2, 3779);
    			add_location(main, file$3, 142, 0, 3770);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section);
    			append_dev(section, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h10);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h3);
    			append_dev(h3, svg);
    			append_dev(svg, path);
    			append_dev(h3, t2);
    			append_dev(div1, t3);
    			append_dev(div1, h40);
    			append_dev(div1, t6);
    			append_dev(div1, h41);
    			append_dev(div1, t9);
    			append_dev(div1, h42);
    			append_dev(div4, t12);
    			append_dev(div4, h11);
    			append_dev(section, t14);
    			append_dev(section, div9);
    			append_dev(div9, div8);
    			append_dev(div8, h12);
    			append_dev(div8, t16);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			if (if_block) if_block.m(div6, null);
    			append_dev(div6, t17);
    			append_dev(div6, div5);
    			append_dev(div5, button0);
    			append_dev(button0, h13);
    			append_dev(button0, t19);
    			append_dev(button0, h14);
    			append_dev(h14, t20);
    			append_dev(div5, t21);
    			append_dev(div5, button1);
    			append_dev(button1, h15);
    			append_dev(button1, t23);
    			append_dev(button1, h16);
    			append_dev(h16, t24);
    			append_dev(div5, t25);
    			append_dev(div5, button2);
    			append_dev(button2, h17);
    			append_dev(button2, t27);
    			append_dev(button2, h18);
    			append_dev(h18, t28);
    			append_dev(div5, t29);
    			append_dev(div5, button3);
    			append_dev(button3, h19);
    			append_dev(button3, t31);
    			append_dev(button3, h110);
    			append_dev(h110, t32);
    			append_dev(div6, t33);
    			append_dev(div6, p);
    			append_dev(p, t34);
    			append_dev(p, a);
    			append_dev(div9, t36);
    			append_dev(div9, h111);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*vector*/ ctx[0].bt_pred) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div6, t17);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*vector*/ 1 && t20_value !== (t20_value = /*vector*/ ctx[0].bx_pred.toFixed(2) + "")) set_data_dev(t20, t20_value);
    			if (dirty & /*vector*/ 1 && t24_value !== (t24_value = /*vector*/ ctx[0].by_pred.toFixed(2) + "")) set_data_dev(t24, t24_value);
    			if (dirty & /*vector*/ 1 && t28_value !== (t28_value = /*vector*/ ctx[0].bz_pred.toFixed(2) + "")) set_data_dev(t28, t28_value);
    			if (dirty & /*vector*/ 1 && t32_value !== (t32_value = /*vector*/ ctx[0].bt_pred.toFixed(2) + "")) set_data_dev(t32, t32_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const apiKey = "1202a311-b72c-4c0c-87fb-48cd908723c1";
    const baseApiUrl = "https://app-rssi-api-eastus-dev-001.azurewebsites.net";

    async function fetchDscovrData() {
    	let url = "https://services.swpc.noaa.gov/json/dscovr/dscovr_mag_1s.json";

    	try {
    		const response = await fetch(url, {
    			headers: { "Content-Type": "application/json" }
    		});

    		if (response.ok) {
    			// Successfully posted the tweet
    			const data = await response.json();

    			const lastElement = data[data.length - 1];
    			return lastElement;
    		} else {
    			// Handle any errors during the POST request
    			console.error("Failed to fetch data!");
    		}
    	} catch(error) {
    		// Handle network or fetch errors
    		console.error("Error :", error);
    	}
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Analytics', slots, []);
    	const earthApiUrl = baseApiUrl + "/api/earthdata/ncei";
    	const solarWindApiUrl = baseApiUrl + "/api/satellitedata/ace";
    	const predUrl = baseApiUrl + "/api/btregression";
    	let earthData = {};
    	let solarWindData = {};
    	let solarWindPred = {};
    	let data = {};
    	let reconFreqDay;
    	let reconFreqMonth;
    	let reconFreqWeek;

    	let vector = {
    		bt_pred: 0,
    		bx_pred: 0,
    		by_pred: 0,
    		bz_pred: 0
    	};

    	// Function to fetch Earth data
    	async function fetchEarthData() {
    		console.log("Fetching geo-magnetic data");

    		const response = await fetch(earthApiUrl, {
    			headers: {
    				"x-api-key": `${apiKey}`,
    				"Content-Type": "application/json"
    			}
    		});

    		if (response.ok) {
    			earthData = await response.json();
    		} else {
    			console.error("Failed to fetch geomagnetic data!");
    		}
    	}

    	// Function to fetch solar wind data
    	async function fetchSolarWindData() {
    		console.log("Fetching solar wind data");

    		const response = await fetch(solarWindApiUrl, {
    			headers: {
    				"x-api-key": `${apiKey}`,
    				"Content-Type": "application/json"
    			}
    		});

    		if (response.ok) {
    			solarWindData = await response.json();
    		} else {
    			console.error("Failed to fetch solae wind data!");
    		}
    	}

    	// Function to fetch solar wind data
    	async function fetchSolarWindPrediction(wind, earth) {
    		var date = new Date();

    		const requestBody = {
    			year: date.getFullYear(),
    			month: date.getMonth() + 1,
    			bxGSM: wind.bxGSM,
    			byGSM: wind.byGSM,
    			bzGSM: wind.bzGSM,
    			intensity: earth.intensity,
    			declination: earth.declination,
    			inclination: earth.inclination,
    			east: earth.east,
    			north: earth.north,
    			vertical: earth.vertical,
    			horizontal: earth.horizontal,
    			class: 2, /*Class labeled as positive*/
    			
    		};

    		console.log("Fetching solar wind predictions");

    		const response = await fetch(predUrl, {
    			method: "POST",
    			headers: {
    				"x-api-key": `${apiKey}`,
    				"Content-Type": "application/json"
    			},
    			body: JSON.stringify(requestBody)
    		});

    		if (response.ok) {
    			solarWindPred = await response.json();
    		} else {
    			console.error("Failed to fetch prediction!");
    		}
    	}

    	onMount(async () => {
    		// Fetch data from backend
    		await fetchSolarWindData();

    		await fetchEarthData();

    		if (solarWindData != null && earthData != null) {
    			await fetchSolarWindPrediction(solarWindData, earthData);
    		}

    		$$invalidate(0, vector.bt_pred = solarWindPred.bt, vector);
    		data = await fetchDscovrData();
    		$$invalidate(0, vector.bx_pred = vector.bt_pred * Math.cos(data.theta_gsm) * Math.cos(data.phi_gsm), vector);
    		$$invalidate(0, vector.by_pred = vector.bt_pred * Math.cos(data.theta_gsm) * Math.sin(data.phi_gsm), vector);
    		$$invalidate(0, vector.bz_pred = vector.bt_pred * Math.sin(data.theta_gsm), vector);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Analytics> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		apiKey,
    		baseApiUrl,
    		earthApiUrl,
    		solarWindApiUrl,
    		predUrl,
    		earthData,
    		solarWindData,
    		solarWindPred,
    		data,
    		reconFreqDay,
    		reconFreqMonth,
    		reconFreqWeek,
    		vector,
    		fetchEarthData,
    		fetchSolarWindData,
    		fetchSolarWindPrediction,
    		fetchDscovrData
    	});

    	$$self.$inject_state = $$props => {
    		if ('earthData' in $$props) earthData = $$props.earthData;
    		if ('solarWindData' in $$props) solarWindData = $$props.solarWindData;
    		if ('solarWindPred' in $$props) solarWindPred = $$props.solarWindPred;
    		if ('data' in $$props) data = $$props.data;
    		if ('reconFreqDay' in $$props) $$invalidate(1, reconFreqDay = $$props.reconFreqDay);
    		if ('reconFreqMonth' in $$props) $$invalidate(2, reconFreqMonth = $$props.reconFreqMonth);
    		if ('reconFreqWeek' in $$props) $$invalidate(3, reconFreqWeek = $$props.reconFreqWeek);
    		if ('vector' in $$props) $$invalidate(0, vector = $$props.vector);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [vector, reconFreqDay, reconFreqMonth, reconFreqWeek];
    }

    class Analytics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Analytics",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\routes\v_chart.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\routes\\v_chart.svelte";

    function create_fragment$2(ctx) {
    	let br;
    	let t0;
    	let main;
    	let div2;
    	let div0;
    	let canvas0;
    	let t1;
    	let div1;
    	let canvas1;
    	let t2;
    	let div3;
    	let analytics;
    	let current;
    	analytics = new Analytics({ $$inline: true });

    	const block = {
    		c: function create() {
    			br = element("br");
    			t0 = space();
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			canvas0 = element("canvas");
    			t1 = space();
    			div1 = element("div");
    			canvas1 = element("canvas");
    			t2 = space();
    			div3 = element("div");
    			create_component(analytics.$$.fragment);
    			add_location(br, file$2, 169, 0, 4021);
    			attr_dev(canvas0, "id", "magnetometerChart");
    			set_style(canvas0, "box-shadow", "0px 8px 15px -10px rgb(0, 255, 213)");
    			add_location(canvas0, file$2, 174, 6, 4140);
    			attr_dev(div0, "class", "border border-[#ffffff4d]/30");
    			add_location(div0, file$2, 173, 4, 4091);
    			attr_dev(canvas1, "id", "orientationChart");
    			attr_dev(canvas1, "class", "border-b border-[#1df2f0]/70");
    			set_style(canvas1, "box-shadow", "0px 8px 15px -10px rgb(0, 255, 213)");
    			add_location(canvas1, file$2, 181, 6, 4363);
    			attr_dev(div1, "class", "border border-[#ffffff4d]/30");
    			add_location(div1, file$2, 180, 4, 4314);
    			attr_dev(div2, "class", "grid grid-cols-2 gap-x-10");
    			add_location(div2, file$2, 172, 2, 4047);
    			attr_dev(div3, "class", "analytics");
    			add_location(div3, file$2, 189, 2, 4587);
    			attr_dev(main, "class", "");
    			add_location(main, file$2, 171, 0, 4029);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, canvas0);
    			/*canvas0_binding*/ ctx[2](canvas0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, canvas1);
    			/*canvas1_binding*/ ctx[3](canvas1);
    			append_dev(main, t2);
    			append_dev(main, div3);
    			mount_component(analytics, div3, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(analytics.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(analytics.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			/*canvas0_binding*/ ctx[2](null);
    			/*canvas1_binding*/ ctx[3](null);
    			destroy_component(analytics);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('V_chart', slots, []);
    	let magnetometerChart;
    	let orientationChart;

    	onMount(() => {
    		const magnetometerCtx = magnetometerChart.getContext("2d");
    		const orientationCtx = orientationChart.getContext("2d");

    		// Data for the magnetometer chart
    		const magnetometerData = {
    			labels: ["June", "July", "Aug", "Sept", "Oct"],
    			datasets: [
    				{
    					label: "Bt",
    					data: [50, 55, 60, 65, 70],
    					borderColor: "#94D2BD",
    					borderWidth: 2,
    					fill: false
    				},
    				{
    					label: "ByGSM",
    					data: [20, 25, 30, 35, 40],
    					borderColor: "#EE9B00",
    					borderWidth: 2,
    					fill: false
    				},
    				{
    					label: "BxGSM",
    					data: [70, 75, 80, 85, 90],
    					borderColor: "#FB3602",
    					borderWidth: 2,
    					fill: false
    				},
    				{
    					label: "BzGSM",
    					data: [30, 35, 40, 45, 50],
    					borderColor: "#AF1724",
    					borderWidth: 2,
    					fill: false
    				}
    			]
    		};

    		// Data for the orientation chart (intensity, inclination, declination, north, east, vertical, horizontal)
    		const orientationData = {
    			labels: ["June", "July", "Aug", "Sept", "Oct"],
    			datasets: [
    				{
    					label: "Intensity",
    					data: [100, 110, 120, 130, 140],
    					borderColor: "#015666",
    					borderWidth: 1,
    					fill: false
    				},
    				{
    					label: "Inclination",
    					data: [10, 15, 20, 25, 30],
    					borderColor: "#0A9396",
    					borderWidth: 2,
    					fill: false
    				},
    				{
    					label: "Declination",
    					data: [-10, -15, -20, -25, -30],
    					borderColor: "#94D2BD",
    					borderWidth: 2,
    					fill: false
    				},
    				{
    					label: "North",
    					data: [50, 55, 60, 65, 70],
    					borderColor: "#EE9B00",
    					borderWidth: 2,
    					fill: false
    				},
    				{
    					label: "East",
    					data: [-20, -25, -30, -35, -40],
    					borderColor: "#CA6702",
    					borderWidth: 2,
    					fill: false
    				},
    				{
    					label: "Vertical",
    					data: [-30, -35, -40, -45, -50],
    					borderColor: "#FB3602",
    					borderWidth: 2,
    					fill: false
    				},
    				{
    					label: "Horizontal",
    					data: [70, 75, 80, 85, 90],
    					borderColor: "#AF1724",
    					borderWidth: 2,
    					fill: false
    				}
    			]
    		};

    		// Adjust the chart height for larger charts
    		const chartHeight = 600; // Set the desired height here

    		const commonOptions = {
    			maintainAspectRatio: true, // Enable aspect ratio
    			
    		};

    		const magnetometerConfig = {
    			type: "line",
    			data: magnetometerData,
    			options: {
    				...commonOptions,
    				scales: {
    					y: {
    						beginAtZero: true,
    						title: { display: true, text: "Magnetometer Data" }
    					},
    					x: { title: { display: true, text: "Month" } }
    				}
    			}
    		};

    		const orientationConfig = {
    			type: "line",
    			data: orientationData,
    			options: {
    				...commonOptions,
    				scales: {
    					y: {
    						beginAtZero: true,
    						title: { display: true, text: "Orientation Data" }
    					},
    					x: { title: { display: true, text: "Month" } }
    				}
    			}
    		};

    		const resizeCharts = () => {
    			$$invalidate(0, magnetometerChart.height = chartHeight, magnetometerChart);
    			$$invalidate(1, orientationChart.height = chartHeight, orientationChart);
    		};

    		new Chart(magnetometerCtx, magnetometerConfig);
    		new Chart(orientationCtx, orientationConfig);

    		// Resize charts initially
    		resizeCharts();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<V_chart> was created with unknown prop '${key}'`);
    	});

    	function canvas0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			magnetometerChart = $$value;
    			$$invalidate(0, magnetometerChart);
    		});
    	}

    	function canvas1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			orientationChart = $$value;
    			$$invalidate(1, orientationChart);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Chart,
    		Analytics,
    		magnetometerChart,
    		orientationChart
    	});

    	$$self.$inject_state = $$props => {
    		if ('magnetometerChart' in $$props) $$invalidate(0, magnetometerChart = $$props.magnetometerChart);
    		if ('orientationChart' in $$props) $$invalidate(1, orientationChart = $$props.orientationChart);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [magnetometerChart, orientationChart, canvas0_binding, canvas1_binding];
    }

    class V_chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "V_chart",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\routes\index.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\routes\\index.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (75:8) {#each satelliteData as satellite}
    function create_each_block(ctx) {
    	let li;
    	let strong;
    	let t0_value = /*satellite*/ ctx[5].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*satellite*/ ctx[5].position + "";
    	let t3;
    	let t4;
    	let t5_value = /*satellite*/ ctx[5].status + "";
    	let t5;
    	let t6;

    	const block = {
    		c: function create() {
    			li = element("li");
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = text(", ");
    			t5 = text(t5_value);
    			t6 = space();
    			attr_dev(strong, "class", "bg-[#FA8322]/90 p-[2px] text-xs");
    			add_location(strong, file$1, 76, 12, 2305);
    			add_location(li, file$1, 75, 10, 2288);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, strong);
    			append_dev(strong, t0);
    			append_dev(strong, t1);
    			append_dev(li, t2);
    			append_dev(li, t3);
    			append_dev(li, t4);
    			append_dev(li, t5);
    			append_dev(li, t6);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(75:8) {#each satelliteData as satellite}",
    		ctx
    	});

    	return block;
    }

    // (108:4) {#if displayHome}
    function create_if_block_1(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(108:4) {#if displayHome}",
    		ctx
    	});

    	return block;
    }

    // (113:4) {#if displayIndex}
    function create_if_block(ctx) {
    	let vchart;
    	let current;
    	vchart = new V_chart({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(vchart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(vchart, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(vchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(vchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(vchart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(113:4) {#if displayIndex}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div3;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let a;
    	let i;
    	let t5;
    	let div2;
    	let h2;
    	let t7;
    	let ul;
    	let t8;
    	let section;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*satelliteData*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block0 = /*displayHome*/ ctx[0] && create_if_block_1(ctx);
    	let if_block1 = /*displayIndex*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Main";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Visualization";
    			t4 = space();
    			a = element("a");
    			i = element("i");
    			t5 = space();
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Satellite Information";
    			t7 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t9 = space();
    			if (if_block1) if_block1.c();
    			if (!src_url_equal(img.src, img_src_value = "logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "w-[16rem] opacity-80");
    			add_location(img, file$1, 41, 6, 1179);
    			attr_dev(button0, "id", "home-button");
    			attr_dev(button0, "class", "text-xs focus:scale-110 focus:border-b focus:border-[#1df2f0]");
    			add_location(button0, file$1, 44, 8, 1339);
    			attr_dev(button1, "class", "text-xs focus:scale-110 focus:border-b focus:border-[#1df2f0]");
    			add_location(button1, file$1, 52, 8, 1587);
    			attr_dev(i, "class", "fa-brands fa-x-twitter");
    			set_style(i, "color", "#1df2f0");
    			add_location(i, file$1, 61, 10, 1874);
    			attr_dev(a, "href", "https://twitter.com/RssiSpaceApps23");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$1, 60, 8, 1801);
    			attr_dev(div0, "class", "space-x-5 border-l pl-5");
    			add_location(div0, file$1, 42, 6, 1244);
    			attr_dev(div1, "class", "flex space-x-10 border-b border-t border-white/30 py-2 items-center w-[83%]");
    			add_location(div1, file$1, 32, 4, 821);
    			attr_dev(h2, "class", "uppercase grid border-b border-white/30 bg-[#132E27] py-2 border-r w-full text-xs ");
    			add_location(h2, file$1, 66, 6, 1998);
    			attr_dev(ul, "class", "border-white/50 space-y-2 pl-2 pr-10 py-2 w-fit relative");
    			add_location(ul, file$1, 73, 6, 2164);
    			attr_dev(div2, "class", "");
    			add_location(div2, file$1, 65, 4, 1977);
    			attr_dev(div3, "class", "w-full flex justify-between items-start mt-5");
    			add_location(div3, file$1, 31, 2, 758);
    			attr_dev(section, "class", "");
    			add_location(section, file$1, 86, 2, 2528);
    			attr_dev(main, "class", "bg m-10");
    			add_location(main, file$1, 30, 0, 733);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t2);
    			append_dev(div0, button1);
    			append_dev(div0, t4);
    			append_dev(div0, a);
    			append_dev(a, i);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, h2);
    			append_dev(div2, t7);
    			append_dev(div2, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(main, t8);
    			append_dev(main, section);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t9);
    			if (if_block1) if_block1.m(section, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*showHome*/ ctx[3], false, false, false, false),
    					listen_dev(button1, "click", /*showIndex*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*satelliteData*/ 4) {
    				each_value = /*satelliteData*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*displayHome*/ ctx[0]) {
    				if (if_block0) {
    					if (dirty & /*displayHome*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t9);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*displayIndex*/ ctx[1]) {
    				if (if_block1) {
    					if (dirty & /*displayIndex*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Routes', slots, []);

    	let satelliteData = [
    		{
    			name: "ACE",
    			position: "L1",
    			status: "Active"
    		},
    		{
    			name: "DSCOVR",
    			position: "L1",
    			status: "Active"
    		}
    	];

    	// Create a variable to track which component to display
    	let displayHome = false;

    	let displayIndex = true; // Display the index component by default

    	// Function to display the Home component
    	function showHome() {
    		$$invalidate(0, displayHome = true);
    		$$invalidate(1, displayIndex = false);
    		s;
    	}

    	// Function to display the index.svelte component
    	function showIndex() {
    		$$invalidate(0, displayHome = false);
    		$$invalidate(1, displayIndex = true);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Routes> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link,
    		Home,
    		VChart: V_chart,
    		satelliteData,
    		displayHome,
    		displayIndex,
    		showHome,
    		showIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ('satelliteData' in $$props) $$invalidate(2, satelliteData = $$props.satelliteData);
    		if ('displayHome' in $$props) $$invalidate(0, displayHome = $$props.displayHome);
    		if ('displayIndex' in $$props) $$invalidate(1, displayIndex = $$props.displayIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [displayHome, displayIndex, satelliteData, showHome, showIndex];
    }

    class Routes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Routes",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    // (12:2) <Router>
    function create_default_slot(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let current;

    	route0 = new Route({
    			props: { path: "/", component: Routes },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "/home", component: Home },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: { path: "/chart", component: V_chart },
    			$$inline: true
    		});

    	route3 = new Route({
    			props: { path: "/analytics", component: Analytics },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(route3, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(route3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(12:2) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file, 10, 0, 291);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Index: Routes,
    		Home,
    		VChart: V_chart,
    		Analytics
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
