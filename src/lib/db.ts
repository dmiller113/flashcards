export type CreateDatabaseOptions = Partial<{
	onBlock: (event: IDBVersionChangeEvent) => void;
	onError: (error: IDBOpenDBRequest['error']) => void;
	onSuccess: (result: IDBOpenDBRequest['result']) => void;
	onUpgrade: (event: IDBVersionChangeEvent) => void;
}>;

export const getIndexedDb = (
	name: string,
	version: number,
	{ onBlock, onError, onSuccess, onUpgrade }: CreateDatabaseOptions = {},
): Promise<IDBDatabase> => {
	const request: IDBOpenDBRequest = window.indexedDB.open(name, version);
	if (onBlock !== undefined) request.onblocked = onBlock;
	if (onUpgrade !== undefined) request.onupgradeneeded = onUpgrade;

	return wrapInPromise(
		request,
		{
			onReject: onError,
			onResolve: onSuccess,
		},
	)
};

type AddObjectSignature = (value: any, key?: IDBValidKey) => Promise<IDBValidKey>;
type GetObjectSignature = <T extends object>(key: IDBValidKey) => Promise<T>;
type PutObjectSignature = (value: any, key?: IDBValidKey) => Promise<IDBValidKey>;

type ObjectStoreHelper = {
	_objectStore: IDBObjectStore;
	_transaction: IDBTransaction;
	addObject: AddObjectSignature;
	getObject: GetObjectSignature;
	putObject: PutObjectSignature;
};

export const getObjectStore = (
	database: IDBDatabase,
	objectStoreName: string,
	{
		transaction: rawTransaction,
		transactionDurability = 'relaxed',
		transactionMode = 'readonly',
	}: Partial<{
		transaction: IDBTransaction;
		transactionDurability: 'strict' | 'relaxed' | 'default';
		transactionMode: IDBTransactionMode;
	}> = {},
): ObjectStoreHelper => {
	const transaction = rawTransaction === undefined
		? database.transaction(
			[objectStoreName],
			transactionMode,
			{ durability: transactionDurability },
		) 
		: rawTransaction;
	const objectStore = transaction.objectStore(objectStoreName)

	return {
		_objectStore: objectStore,
		_transaction: transaction,
		addObject: makeAddObject(objectStore),
		getObject: makeGetObject(objectStore),
		putObject: makePutObject(objectStore),
	};
};

export const makeAddObject: (
	objStore: IDBObjectStore,
) => AddObjectSignature = (
	objStore,
) => async (
	obj: any,
	key?: IDBValidKey,
) => {
	const request = objStore.add(obj, key);
	
	return wrapInPromise(
		request,
	)
};

export const makeGetObject: (objStore: IDBObjectStore) => GetObjectSignature = (
	objectStore,
) => (
	key: IDBValidKey,
) => {
	const request = objectStore.get(key);

	return wrapInPromise(request);
}

export const makePutObject: (
	objStore: IDBObjectStore,
) => AddObjectSignature = (
	objStore,
) => async (
	obj: any,
	key?: IDBValidKey,
) => {
	const request = objStore.put(obj, key);
	
	return wrapInPromise(
		request,
	)
};

type BuildObjectStoreFunction =
	() => Promise<void>;

type MakeIndexFunction = (
	indexName: string,
	keyPath: string | ReadonlyArray<string>,
	options?: Partial<{ locale: string; multiEntry: boolean; unique: boolean }>,
) => ObjectStoreBuilder

type ObjectStoreBuilder = {
	db: IDBDatabase;
	build: BuildObjectStoreFunction;
	makeIndex: MakeIndexFunction;
	syncBuild: () => void,
};

export const makeObjectStoreBuilder = (
	db: IDBDatabase,
	storeName: string,
	options?: Partial<{ autoIncrement: boolean; keyPath: string; }>,
) => {
	const objectStore = db.createObjectStore(storeName, options);
	let operations: ReadonlyArray<() => void> = [];
	let retObject: ObjectStoreBuilder

	const syncBuild = () => {
		operations.forEach((f) => f());
	};

	const build = () => new Promise<void>(
		(resolve, reject) => {
			syncBuild();

			objectStore.transaction.oncomplete = () => resolve();
			objectStore.transaction.onerror = (e) => reject(e);
		},
	);

	const makeIndex: MakeIndexFunction = (
		indexName,
		keyPath,
		options,
	) => {
		operations =
			operations.concat(() => objectStore.createIndex(indexName, keyPath, options));

		return retObject;
	}

	retObject = {
		build,
		db,
		makeIndex,
		syncBuild,
	}

	return retObject;
}

type WrappingOptions<
	T extends IDBRequest = IDBRequest,
	VResult = T['result'],
	VReject = T['error']
> = {
	onReject: (err: T['error']) => VReject | void;
	onResolve: (res: T['result']) => VResult | void;
	resolveEventName: string;
	rejectEventName: string;
};

const wrapInPromise = <T extends IDBRequest>(
  request: T,
	{
		onReject,
		onResolve,
		rejectEventName = 'error',
		resolveEventName = 'success',
	}: Partial<WrappingOptions> = {},
): Promise<T['result']> => {
  return new Promise((resolve, reject) => {
    const handleResolve = () => {
      request.removeEventListener(rejectEventName, handleReject);

			let result = request.result;
			if (onResolve !== undefined) result = onResolve(result) ?? result;

      resolve(result);
    };
    
    const handleReject = () => {
      request.removeEventListener(resolveEventName, handleResolve);

			let error = request.error;
			if (onReject !== undefined) error = onReject(error) ?? error;

      reject(request.error);
    };
    
    request.addEventListener(resolveEventName, handleResolve, { once: true });
    request.addEventListener(rejectEventName, handleReject, { once: true });
  });
}

