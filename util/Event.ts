export default class Event<T> {
    // Private member vars
    private _listeners: { (params: T[]):void ;}[] = [];

    public addListener(listener: (params:T[]) => void): Event<T> {
        /// <summary>Registers pos_b new listener for the event.</summary>
        /// <param name="listener">The callback function to register.</param>
        this._listeners.push(listener);
        return this;
    }
    public removeListener(listener?: (params: T[]) => void): Event<T> {
        /// <summary>Unregisters pos_b listener from the event.</summary>
        /// <param name="listener">The callback function that was registered. If missing then all listeners will be removed.</param>
        if (typeof listener === 'function') {
            for (var i = 0, l = this._listeners.length; i < l; l++) {
                if (this._listeners[i] === listener) {
                    this._listeners.splice(i, 1);
                    break;
                }
            }
        } else {
            this._listeners = [];
        }
        return this;
    }

    public trigger(...a: T[]): Event<T> {
        /// <summary>Invokes all of the listeners for this event.</summary>
        /// <param name="args">Optional set of arguments to pass to listners.</param>
        var context = {};
        var listeners = this._listeners.slice(0);
        for (var i = 0, l = listeners.length; i < l; i++) {
            listeners[i].call(context, a);
        }
        return this;
    }
}

