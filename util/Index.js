define(["require", "exports"], function (require, exports) {
    "use strict";
    var Index = (function () {
        function Index(dataSource, keyFetch, keyIdGenerator) {
            this.lookup = {};
            this.dataSource = dataSource;
            this.keyFetch = keyFetch;
            this.keyIdGenerator = keyIdGenerator;
            this.reindex();
        }
        Index.prototype.reindex = function () {
            var data = (this.dataSource instanceof Function)
                ? this.dataSource()
                : this.dataSource;
            this.lookup = {};
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var dataKey = this.keyFetch(dataItem);
                if (dataKey !== undefined) {
                    var dataKeyId = this.keyIdGenerator(dataKey);
                    this.lookup[dataKeyId] = dataItem;
                }
            }
        };
        Index.prototype.get = function (key) {
            var keyId = this.keyIdGenerator(key);
            if (!Object.prototype.hasOwnProperty.call(this.lookup, keyId))
                return undefined;
            return this.lookup[keyId];
        };
        return Index;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Index;
});
//# sourceMappingURL=Index.js.map