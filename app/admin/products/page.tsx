'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';

type CategoryNode = {
    _id: string;
    id?: string;
    name: string;
    parent?: string | null;
    ancestors?: Array<{ _id: string; name: string }>;
    children?: CategoryNode[];
};

type ProductItem = {
    _id?: string;
    product_id: number;
    product_code?: string;
    name: string;
    title?: string;
    sku?: string;
    price?: number;
    selling_price?: number;
    description?: string;
    quantity?: number;
    status?: string;
    catagory_id?: { _id?: string; name?: string } | string;
    product_image?: string[];
    video_url?: string;
    colors?: string[];
    sizes?: string[];
    colorVariants?: Array<{
        color: string;
        images?: string[];
        video?: string;
        sizes?: Array<{ label: string; stock: number }>;
        primary?: boolean;
    }>;
    specifications?: Array<{ key: string; value: string }>;
};

type SpecificationRow = { key: string; value: string };
type VariantSizeRow = { label: string; stock: number };

type VariantRow = {
    color: string;
    sizes: VariantSizeRow[];
    existingImages: string[];
    newImages: File[];
    existingVideo: string;
    newVideo: File | null;
};

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
const CATEGORY_LEVEL_LABELS = ['Category', 'Sub Category', 'Sub Child Category'];
const DESCRIPTION_MAX_LENGTH = 1200;
const SPECIFICATIONS_MIN = 6;
const SPECIFICATIONS_MAX = 10;
const SKU_PATTERN = /^[A-Z]{2}-\d{3}$/;
const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080').replace(/\/$/, '');

const createEmptyVariant = (): VariantRow => ({
    color: '',
    sizes: [{ label: 'M', stock: 0 }],
    existingImages: [],
    newImages: [],
    existingVideo: '',
    newVideo: null,
});

const createEmptySpec = (): SpecificationRow => ({ key: '', value: '' });

const categoryIdOf = (node: CategoryNode) => String(node._id || node.id || '');

const parseCategoryId = (value: ProductItem['catagory_id']) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value._id || '';
};

const formatCurrency = (value?: number) => {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n.toFixed(2) : '0.00';
};

const toUpper = (value: string) => value.toUpperCase();

const normalizeSkuInput = (value: string) => {
    const clean = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const letters = clean.replace(/[^A-Z]/g, '').slice(0, 2);
    const digits = clean.replace(/[^0-9]/g, '').slice(0, 3);
    if (!letters) return '';
    if (letters.length < 2) return letters;
    return digits ? `${letters}-${digits}` : `${letters}-`;
};

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const toEditorHtml = (value: string) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
    return escapeHtml(raw).replace(/\n/g, '<br/>');
};

const stripHtmlToPlainText = (html: string) => {
    if (!html) return '';
    if (typeof document === 'undefined') {
        return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    const node = document.createElement('div');
    node.innerHTML = html;
    return (node.textContent || '').replace(/\s+/g, ' ').trim();
};

const insertPlainTextAtCaret = (text: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        document.execCommand('insertText', false, text);
        return;
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
};

function flattenCategoryPaths(nodes: CategoryNode[], path: string[] = []): string[][] {
    const all: string[][] = [];
    for (const node of nodes) {
        const id = categoryIdOf(node);
        if (!id) continue;
        const next = [...path, id];
        const hasChildren = !!node.children?.length;
        if (!hasChildren) all.push(next);
        if (hasChildren) all.push(...flattenCategoryPaths(node.children || [], next));
    }
    return all;
}

function findPathToCategory(nodes: CategoryNode[], targetId: string): string[] {
    if (!targetId) return [];
    const paths = flattenCategoryPaths(nodes);
    for (const path of paths) {
        if (path.includes(targetId)) {
            return path.slice(0, path.indexOf(targetId) + 1);
        }
    }
    return [];
}

function getNodesAtDepth(nodes: CategoryNode[], selectedPath: string[], depth: number): CategoryNode[] {
    if (depth === 0) {
        return nodes.filter((n) => !n.parent && !(n.ancestors && n.ancestors.length > 0));
    }
    let current = nodes;
    for (let d = 0; d < depth; d += 1) {
        const selectedId = selectedPath[d];
        const selectedNode = current.find((n) => categoryIdOf(n) === selectedId);
        if (!selectedNode?.children?.length) return [];
        current = selectedNode.children;
    }
    return current;
}

function findNodeByPath(nodes: CategoryNode[], path: string[]): CategoryNode | null {
    let currentNodes = nodes;
    let currentNode: CategoryNode | null = null;
    for (const id of path) {
        currentNode = currentNodes.find((n) => categoryIdOf(n) === id) || null;
        if (!currentNode) return null;
        currentNodes = currentNode.children || [];
    }
    return currentNode;
}

function findNamesByPath(nodes: CategoryNode[], path: string[]): string[] {
    const names: string[] = [];
    let currentNodes = nodes;
    for (const id of path) {
        const currentNode = currentNodes.find((n) => categoryIdOf(n) === id);
        if (!currentNode) break;
        names.push(currentNode.name);
        currentNodes = currentNode.children || [];
    }
    return names;
}

export default function AdminProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { settings } = useSiteSettings();
    const currency = settings.currencySymbol || '$';

    const [products, setProducts] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    const [categoryPath, setCategoryPath] = useState<string[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [specifications, setSpecifications] = useState<SpecificationRow[]>([createEmptySpec()]);
    const [variants, setVariants] = useState<VariantRow[]>([createEmptyVariant()]);
    const [descriptionTextLength, setDescriptionTextLength] = useState(0);

    const descriptionEditorRef = useRef<HTMLDivElement | null>(null);
    const lastValidDescriptionHtmlRef = useRef('');
    const savedSelectionRef = useRef<Range | null>(null);

    const activeCategoryNode = useMemo(() => findNodeByPath(categories, categoryPath), [categories, categoryPath]);
    const selectedCategoryNames = useMemo(() => findNamesByPath(categories, categoryPath), [categories, categoryPath]);
    const isLeafSelected = !!activeCategoryNode && !(activeCategoryNode.children && activeCategoryNode.children.length > 0);
    const selectedCategoryId = categoryPath[categoryPath.length - 1] || '';
    const hasThreeLevelSelection = categoryPath.length === 3;

    const totalStock = useMemo(
        () => variants.reduce((acc, v) => acc + v.sizes.reduce((sum, s) => sum + Number(s.stock || 0), 0), 0),
        [variants]
    );

    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return products;
        return products.filter((p) => {
            const categoryName = typeof p.catagory_id === 'object' ? p.catagory_id?.name || '' : '';
            return (
                String(p.product_id).includes(q) ||
                String(p.name || '').toLowerCase().includes(q) ||
                String(p.sku || '').toLowerCase().includes(q) ||
                String(categoryName).toLowerCase().includes(q)
            );
        });
    }, [products, search]);

    const resetEditor = () => {
        setStep(1);
        setEditingProductId(null);
        setCategoryPath([]);
        setNewCategoryName('');
        setName('');
        setDescription('');
        setSku('');
        setPrice('');
        setSellingPrice('');
        setSpecifications([createEmptySpec()]);
        setVariants([createEmptyVariant()]);
        setDescriptionTextLength(0);
        lastValidDescriptionHtmlRef.current = '';
        setError('');
    };

    const syncDescriptionFromEditor = () => {
        const html = descriptionEditorRef.current?.innerHTML || '';
        const textLength = stripHtmlToPlainText(html).length;
        setDescription(html);
        setDescriptionTextLength(textLength);
        lastValidDescriptionHtmlRef.current = html;
    };

    const saveEditorSelection = () => {
        const editor = descriptionEditorRef.current;
        if (!editor) return;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (!editor.contains(range.commonAncestorContainer)) return;
        savedSelectionRef.current = range.cloneRange();
    };

    const restoreEditorSelection = () => {
        const selection = window.getSelection();
        const range = savedSelectionRef.current;
        const editor = descriptionEditorRef.current;
        if (!selection || !range || !editor) return;
        if (!editor.contains(range.commonAncestorContainer)) return;
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handleDescriptionInput: React.FormEventHandler<HTMLDivElement> = () => {
        const editor = descriptionEditorRef.current;
        if (!editor) return;
        const html = editor.innerHTML;
        const textLength = stripHtmlToPlainText(html).length;

        if (textLength > DESCRIPTION_MAX_LENGTH) {
            editor.innerHTML = lastValidDescriptionHtmlRef.current;
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            return;
        }

        setDescription(html);
        setDescriptionTextLength(textLength);
        lastValidDescriptionHtmlRef.current = html;
    };

    const handleDescriptionPaste: React.ClipboardEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        const plainText = event.clipboardData.getData('text/plain') || '';
        const editor = descriptionEditorRef.current;
        if (!editor) return;

        editor.focus();
        restoreEditorSelection();
        insertPlainTextAtCaret(plainText);
        saveEditorSelection();
        syncDescriptionFromEditor();
    };

    const runDescriptionCommand = (command: string, value?: string) => {
        const editor = descriptionEditorRef.current;
        if (!editor) return;
        editor.focus();
        restoreEditorSelection();
        if (command === 'foreColor' || command === 'hiliteColor') {
            document.execCommand('styleWithCSS', false, 'true');
        }
        document.execCommand(command, false, value);
        saveEditorSelection();
        syncDescriptionFromEditor();
    };

    const applyDescriptionHeading = (value: 'P' | 'H1' | 'H2' | 'H3') => {
        const map: Record<'P' | 'H1' | 'H2' | 'H3', string> = {
            P: '<p>',
            H1: '<h1>',
            H2: '<h2>',
            H3: '<h3>',
        };
        runDescriptionCommand('formatBlock', map[value]);
    };

    const keepEditorSelectionOnToolbarMouseDown: React.MouseEventHandler<HTMLElement> = (event) => {
        event.preventDefault();
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        resetEditor();
        router.push('/admin/products');
    };

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch(`${BACKEND_URL}/admin/get-products`, { cache: 'no-store' }),
                fetch(`${BACKEND_URL}/admin/categories/tree`, { cache: 'no-store' }),
            ]);

            const productsJson = await productsRes.json();
            const categoriesJson = await categoriesRes.json();

            setProducts(Array.isArray(productsJson?.products) ? productsJson.products : []);
            setCategories(Array.isArray(categoriesJson?.categories) ? categoriesJson.categories : []);
        } catch {
            setError('Failed to load admin data. Check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!isEditorOpen) return;

        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;
        const adminScrollRoot = document.getElementById('admin-scroll-root');
        const previousAdminOverflow = adminScrollRoot?.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        if (adminScrollRoot) {
            adminScrollRoot.style.overflow = 'hidden';
        }

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
            if (adminScrollRoot) {
                adminScrollRoot.style.overflow = previousAdminOverflow || '';
            }
        };
    }, [isEditorOpen]);

    useEffect(() => {
        const mode = searchParams.get('mode');
        const id = searchParams.get('productId');

        if (mode === 'new') {
            resetEditor();
            setIsEditorOpen(true);
            return;
        }

        if (mode === 'edit' && id) {
            const numericId = Number(id);
            if (Number.isFinite(numericId)) {
                const product = products.find((p) => p.product_id === numericId);
                if (product) {
                    setIsEditorOpen(true);
                    setEditingProductId(product.product_id);
                    setStep(1);

                    setName(product.name || product.title || '');
                    setDescription(toEditorHtml(product.description || ''));
                    setSku(product.sku || '');
                    setPrice(String(product.price ?? ''));
                    setSellingPrice(String(product.selling_price ?? product.price ?? ''));

                    const specRows = Array.isArray(product.specifications) && product.specifications.length
                        ? product.specifications.map((s) => ({ key: s.key || '', value: s.value || '' }))
                        : [createEmptySpec()];
                    setSpecifications(specRows);

                    const productCategoryId = parseCategoryId(product.catagory_id);
                    setCategoryPath(findPathToCategory(categories, productCategoryId));

                    const mappedVariants: VariantRow[] = Array.isArray(product.colorVariants) && product.colorVariants.length
                        ? product.colorVariants.map((v) => ({
                            color: v.color || '',
                            sizes:
                                Array.isArray(v.sizes) && v.sizes.length
                                    ? v.sizes.map((s) => ({ label: s.label || 'M', stock: Number(s.stock || 0) }))
                                    : [{ label: 'M', stock: 0 }],
                            existingImages: Array.isArray(v.images) ? v.images : [],
                            newImages: [],
                            existingVideo: v.video || '',
                            newVideo: null,
                        }))
                        : [
                            {
                                color: product.colors?.[0] || '',
                                sizes:
                                    product.sizes?.length
                                        ? product.sizes.map((size) => ({ label: size, stock: 0 }))
                                        : [{ label: 'M', stock: Number(product.quantity || 0) }],
                                existingImages: (product.product_image || []).slice(0, 5),
                                newImages: [],
                                existingVideo: product.video_url || '',
                                newVideo: null,
                            },
                        ];

                    setVariants(mappedVariants);
                    setError('');
                }
            }
        }
    }, [searchParams, products, categories]);

    useEffect(() => {
        if (!isEditorOpen || step !== 2) return;
        const editor = descriptionEditorRef.current;
        if (!editor) return;

        if (editor.innerHTML !== description) {
            editor.innerHTML = description;
        }
        const textLength = stripHtmlToPlainText(description).length;
        setDescriptionTextLength(textLength);
        lastValidDescriptionHtmlRef.current = description;
    }, [description, isEditorOpen, step]);

    const openNew = () => {
        resetEditor();
        setIsEditorOpen(true);
        router.push('/admin/products?mode=new');
    };

    const openEdit = (product: ProductItem) => {
        router.push(`/admin/products?mode=edit&productId=${product.product_id}`);
    };

    const deleteProduct = async (productId: number) => {
        const ok = window.confirm(`Delete product ${productId}?`);
        if (!ok) return;

        try {
            const res = await fetch(`${BACKEND_URL}/admin/delete-product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
            if (!res.ok) throw new Error();
            await loadData();
        } catch {
            setError('Delete failed. Please try again.');
        }
    };

    const addChildCategory = async () => {
        const nameValue = newCategoryName.trim();
        if (!nameValue) return;

        try {
            const parentId = selectedCategoryId || null;
            const res = await fetch(`${BACKEND_URL}/admin/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parentId ? { name: nameValue, parentId } : { name: nameValue }),
            });
            const json = await res.json();
            if (!res.ok || json?.status === false) {
                throw new Error(json?.message || 'Category create failed');
            }

            setNewCategoryName('');
            await loadData();
        } catch {
            setError('Category create failed. Name may already exist at this level.');
        }
    };

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!hasThreeLevelSelection) return 'Select Category > Sub Category > Sub Child Category.';
            if (!isLeafSelected) return 'Select final child category before next step.';
            return '';
        }

        if (currentStep === 2) {
            if (!name.trim() || !description.trim() || !sku.trim()) {
                return 'Fill product name, description and SKU.';
            }
            if (!SKU_PATTERN.test(sku.trim().toUpperCase())) {
                return 'SKU format must be AA-123 (2 uppercase letters, hyphen, 3 digits).';
            }
            const descriptionLength = stripHtmlToPlainText(description).length;
            if (!descriptionLength) return 'Description is required.';
            if (descriptionLength > DESCRIPTION_MAX_LENGTH) {
                return `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less.`;
            }
            if (!price || !sellingPrice) return 'Fill price and selling price.';
            const parsedPrice = Number(price);
            const parsedSellingPrice = Number(sellingPrice);
            if (!Number.isFinite(parsedPrice) || !Number.isFinite(parsedSellingPrice)) {
                return 'Price and selling price must be valid numbers.';
            }
            if (parsedSellingPrice >= parsedPrice) {
                return 'Selling price must be smaller than price.';
            }
            const validSpecs = specifications.filter((s) => s.key.trim() && s.value.trim());
            if (validSpecs.length < SPECIFICATIONS_MIN || validSpecs.length > SPECIFICATIONS_MAX) {
                return `Specifications must be between ${SPECIFICATIONS_MIN} and ${SPECIFICATIONS_MAX}.`;
            }
            return '';
        }

        if (currentStep === 3) {
            for (const variant of variants) {
                if (!variant.color.trim()) return 'Each color variant needs a color name.';
                if (!variant.sizes.length || !variant.sizes.some((s) => s.label.trim())) return 'Add size rows for each color.';
                const imageCount = variant.newImages.length + variant.existingImages.length;
                if (imageCount < 5) return `Color ${variant.color || 'variant'} needs at least 5 images.`;
                if (imageCount > 5) return `Color ${variant.color || 'variant'} max 5 images allowed.`;
            }
            return '';
        }

        return '';
    };

    const handleNext = () => {
        const validationError = validateStep(step);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
        setStep((prev) => Math.min(prev + 1, 3));
    };

    const handleEnterToProceed: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (event.key !== 'Enter' || event.shiftKey) return;
        const targetElement = event.target as HTMLElement;
        const targetTag = targetElement.tagName.toLowerCase();
        if (targetTag === 'textarea' || targetElement.isContentEditable) return;
        event.preventDefault();
        if (step < 3) handleNext();
    };

    const saveProduct = async () => {
        const validationError = validateStep(3);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const form = new FormData();
            form.append('name', toUpper(name.trim()));
            form.append('title', toUpper(name.trim()));
            form.append('description', description);
            form.append('sku', toUpper(sku.trim()));
            form.append('price', String(Number(price || 0)));
            form.append('selling_price', String(Number(sellingPrice || 0)));
            form.append('quantity', String(totalStock));
            form.append('categoryId', selectedCategoryId);
            form.append('status', 'published');
            form.append('draft_stage', 'complete');

            const specMap: Record<string, string> = {};
            specifications.forEach((s) => {
                if (s.key.trim() && s.value.trim()) specMap[s.key.trim()] = s.value.trim();
            });
            form.append('specification', JSON.stringify(specMap));

            const payloadVariants = variants.map((v, index) => ({
                color: v.color.trim(),
                images: v.existingImages,
                imageCount: v.newImages.length + v.existingImages.length,
                sizes: v.sizes
                    .filter((s) => s.label.trim())
                    .map((s) => ({ label: s.label.trim().toUpperCase(), stock: Number(s.stock || 0) })),
                primary: index === 0,
            }));
            form.append('colorVariants', JSON.stringify(payloadVariants));

            variants.forEach((v) => {
                v.newImages.forEach((file) => form.append('variantImages', file));
            });

            const endpoint = editingProductId
                ? `${BACKEND_URL}/admin/update-product/${editingProductId}`
                : `${BACKEND_URL}/admin/upload-product`;
            const method = editingProductId ? 'PATCH' : 'POST';

            const response = await fetch(endpoint, { method, body: form });
            const json = await response.json();

            if (!response.ok || json?.status === false) {
                throw new Error(json?.message || json?.Message || 'Save failed');
            }

            await loadData();
            closeEditor();
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Save failed';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addVariantImages = (variantIndex: number, files: File[]) => {
        const next = [...variants];
        const current = next[variantIndex];
        const remainingSlots = Math.max(0, 5 - current.existingImages.length - current.newImages.length);
        const toAdd = files.slice(0, remainingSlots);
        current.newImages = [...current.newImages, ...toAdd];
        setVariants(next);
    };

    const removeExistingVariantImage = (variantIndex: number, imageIndex: number) => {
        const confirmed = window.confirm('Remove this existing variant image?');
        if (!confirmed) return;

        const next = [...variants];
        next[variantIndex].existingImages = next[variantIndex].existingImages.filter((_, idx) => idx !== imageIndex);
        setVariants(next);
    };

    const removeNewVariantImage = (variantIndex: number, imageIndex: number) => {
        const confirmed = window.confirm('Remove this new variant image?');
        if (!confirmed) return;

        const next = [...variants];
        next[variantIndex].newImages = next[variantIndex].newImages.filter((_, idx) => idx !== imageIndex);
        setVariants(next);
    };

    const renderCategoryColumns = () => {
        const columns: ReactElement[] = [];
        for (let depth = 0; depth < 3; depth += 1) {
            const nodes = getNodesAtDepth(categories, categoryPath, depth);
            columns.push(
                <div key={depth} className="bg-[#ffffff]/5 p-4 border border-[#ffffff]/10 min-w-[240px]">
                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50 mb-3">{CATEGORY_LEVEL_LABELS[depth]}</p>
                    <div className="flex flex-col gap-2 max-h-72 overflow-auto">
                        {!nodes.length && (
                            <div className="px-3 py-2 border border-dashed border-[#ffffff]/10 font-headline text-[10px] uppercase tracking-widest opacity-50">
                                {depth === 0 ? 'No categories found' : 'Select previous level first'}
                            </div>
                        )}
                        {nodes.map((node) => {
                            const id = categoryIdOf(node);
                            const selected = categoryPath[depth] === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => {
                                        const next = categoryPath.slice(0, depth);
                                        next[depth] = id;
                                        setCategoryPath(next);
                                    }}
                                    className={`text-left px-3 py-2 font-headline text-xs uppercase tracking-widest border transition-colors ${selected ? 'bg-[#b90c1b] border-[#b90c1b] text-white' : 'border-[#ffffff]/10 hover:border-[#b90c1b]/70'}`}
                                >
                                    {node.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return columns;
    };

    return (
        <main className="p-3 md:p-10 text-[#fcf8f8]" onKeyDown={handleEnterToProceed}>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#ffffff]/10 pb-6">
                <div>
                    <p className="font-headline text-[10px] tracking-[0.35em] uppercase text-[#b90c1b]">Admin Products</p>
                    <h1 className="font-brand text-5xl md:text-7xl uppercase tracking-tight leading-none mt-2">Inventory Control</h1>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product id, name, sku"
                        className="flex-1 md:w-80 bg-[#ffffff]/5 border border-[#ffffff]/10 px-4 py-3 font-headline text-xs uppercase tracking-widest outline-none focus:border-[#b90c1b]"
                    />
                    <button onClick={openNew} className="px-6 py-3 bg-[#b90c1b] font-brand text-xl uppercase hover:opacity-90 transition-opacity">New Product</button>
                </div>
            </header>

            {error && <p className="mt-4 text-[#ffb5bc] font-headline text-xs uppercase tracking-widest">{error}</p>}

            <section className="mt-8 border border-[#ffffff]/10 overflow-hidden">
                <div className="grid grid-cols-12 gap-3 p-4 bg-[#ffffff]/5 font-headline text-[10px] uppercase tracking-widest opacity-60">
                    <div className="col-span-2">Product ID</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1">Stock</div>
                    <div className="col-span-1">Price</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {loading ? (
                    <div className="p-8 font-headline text-xs uppercase tracking-widest opacity-50">Loading...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 font-headline text-xs uppercase tracking-widest opacity-50">No products found.</div>
                ) : (
                    filteredProducts.map((product) => {
                        const categoryName = typeof product.catagory_id === 'object' ? product.catagory_id?.name || '-' : '-';
                        return (
                            <div key={product.product_id} className="grid grid-cols-12 gap-3 p-4 border-t border-[#ffffff]/10 items-center hover:bg-[#ffffff]/5">
                                <div className="col-span-2 font-headline text-xs uppercase">{product.product_code || product.product_id}</div>
                                <div className="col-span-3 font-brand text-xl uppercase leading-none">{product.name}</div>
                                <div className="col-span-2 font-headline text-[11px] uppercase opacity-70">{categoryName}</div>
                                <div className="col-span-1 font-headline text-xs">{product.quantity || 0}</div>
                                <div className="col-span-1 font-headline text-xs">{currency}{formatCurrency(product.selling_price ?? product.price)}</div>
                                <div className="col-span-1 font-headline text-[10px] uppercase">{product.status || 'draft'}</div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <button onClick={() => openEdit(product)} className="px-3 py-2 border border-[#ffffff]/15 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">Edit</button>
                                    <button onClick={() => deleteProduct(product.product_id)} className="px-3 py-2 border border-[#ffffff]/15 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">Delete</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {isEditorOpen && (
                <section className="fixed inset-0 bg-black/70 z-50 overflow-hidden p-2 md:p-6 overscroll-none">
                    <div className="max-w-7xl mx-auto h-full overflow-hidden">
                        <div className="bg-[#1c1b1b] border border-[#ffffff]/10 p-6 md:p-8 h-full max-h-[96vh] overflow-y-auto overscroll-y-contain">
                            <div className="flex justify-between items-start gap-4 border-b border-[#ffffff]/10 pb-4">
                                <div>
                                    <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-[#b90c1b]">Step {step}/3</p>
                                    <h2 className="font-brand text-4xl md:text-5xl uppercase tracking-tight mt-2">{editingProductId ? 'Edit Product' : 'Create Product'}</h2>
                                </div>
                                <button onClick={closeEditor} className="font-headline text-xs uppercase tracking-widest border border-[#ffffff]/20 px-3 py-2 hover:border-[#b90c1b]">Close</button>
                            </div>

                            {step === 1 && (
                                <div className="pt-6 space-y-6">
                                    <h3 className="font-brand text-3xl uppercase">Category Selection (3 Levels Required)</h3>
                                    <p className="font-headline text-xs uppercase tracking-widest opacity-60">Select Category {'>'} Sub Category {'>'} Sub Child Category. Next only after final leaf selected.</p>
                                    <div className="flex gap-4 overflow-x-auto pb-2">{renderCategoryColumns()}</div>
                                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-50">Selected Path: {selectedCategoryNames.length ? selectedCategoryNames.join(' > ') : 'None'}</p>

                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder={selectedCategoryId ? 'Add child category under selected node' : 'Add root category'}
                                            className="flex-1 bg-[#ffffff]/5 border border-[#ffffff]/10 px-4 py-3 font-headline text-xs uppercase tracking-widest outline-none focus:border-[#b90c1b]"
                                        />
                                        <button onClick={addChildCategory} className="px-5 py-3 border border-[#ffffff]/20 font-headline text-xs uppercase tracking-widest hover:border-[#b90c1b]">Create Category</button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="pt-6 space-y-8">
                                    <h3 className="font-brand text-3xl uppercase">Core Info + Specs</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block font-headline text-[10px] uppercase tracking-widest opacity-60 mb-2">Product Name</label>
                                            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 px-4 py-3 font-brand text-sm uppercase outline-none focus:border-[#b90c1b]" />
                                        </div>
                                        <div>
                                            <label className="block font-headline text-[10px] uppercase tracking-widest opacity-60 mb-2">SKU Code</label>
                                            <input
                                                value={sku}
                                                onChange={(e) => setSku(normalizeSkuInput(e.target.value))}
                                                // placeholder="e.g. AB-001"
                                                maxLength={6}
                                                className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 px-4 py-3 font-headline text-sm uppercase tracking-widest outline-none focus:border-[#b90c1b]"
                                            />
                                            <p className="mt-2 font-headline text-[10px] uppercase tracking-widest opacity-50">Format: AB-123</p>
                                        </div>
                                        <div>
                                            <label className="block font-headline text-[10px] uppercase tracking-widest opacity-60 mb-2">Price</label>
                                            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 px-4 py-3 font-headline text-sm outline-none focus:border-[#b90c1b]" />
                                        </div>
                                        <div>
                                            <label className="block font-headline text-[10px] uppercase tracking-widest opacity-60 mb-2">Selling Price</label>
                                            <input value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} type="number" className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 px-4 py-3 font-headline text-sm outline-none focus:border-[#b90c1b]" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block font-headline text-[10px] uppercase tracking-widest opacity-60 mb-2">Description</label>
                                            <div className="border border-[#ffffff]/10 bg-[#ffffff]/5">
                                                <div className="flex flex-wrap items-center gap-2 border-b border-[#ffffff]/10 p-2">
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => applyDescriptionHeading('P')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">P</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => applyDescriptionHeading('H1')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">H1</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => applyDescriptionHeading('H2')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">H2</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => applyDescriptionHeading('H3')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">H3</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('bold')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">Bold</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('italic')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">Italic</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('underline')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">Underline</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('insertUnorderedList')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">UL</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('insertOrderedList')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">OL</button>
                                                    <label className="flex items-center gap-2 px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest cursor-pointer hover:border-[#b90c1b]">
                                                        Color
                                                        <input
                                                            type="color"
                                                            defaultValue="#1c1b1b"
                                                            onMouseDown={keepEditorSelectionOnToolbarMouseDown}
                                                            onChange={(e) => runDescriptionCommand('foreColor', e.target.value)}
                                                            className="h-4 w-6 bg-transparent border-0 p-0"
                                                        />
                                                    </label>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('removeFormat')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]">Clear</button>
                                                </div>
                                                <div
                                                    ref={descriptionEditorRef}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onInput={handleDescriptionInput}
                                                    onPaste={handleDescriptionPaste}
                                                    onBlur={syncDescriptionFromEditor}
                                                    onMouseUp={saveEditorSelection}
                                                    onKeyUp={saveEditorSelection}
                                                    onFocus={saveEditorSelection}
                                                    className="min-h-36 max-h-72 overflow-y-auto px-4 py-3 font-headline text-xs tracking-wide outline-none focus:border-[#b90c1b]"
                                                />
                                                <div className="flex justify-end px-3 py-2 border-t border-[#ffffff]/10">
                                                    <p className={`font-headline text-[10px] uppercase tracking-widest ${descriptionTextLength > DESCRIPTION_MAX_LENGTH ? 'text-[#ffb5bc]' : 'opacity-60'}`}>
                                                        {descriptionTextLength}/{DESCRIPTION_MAX_LENGTH}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-brand text-2xl uppercase">Specifications</h4>
                                            <button
                                                onClick={() => setSpecifications((prev) => (prev.length >= SPECIFICATIONS_MAX ? prev : [...prev, createEmptySpec()]))}
                                                disabled={specifications.length >= SPECIFICATIONS_MAX}
                                                className="px-3 py-2 border border-[#ffffff]/20 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b] disabled:opacity-40"
                                            >
                                                Add Row
                                            </button>
                                        </div>
                                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">Required: {SPECIFICATIONS_MIN}-{SPECIFICATIONS_MAX} valid rows</p>
                                        {specifications.map((spec, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-3">
                                                <input
                                                    value={spec.key}
                                                    onChange={(e) => {
                                                        const next = [...specifications];
                                                        next[index] = { ...next[index], key: e.target.value };
                                                        setSpecifications(next);
                                                    }}
                                                    placeholder="Key"
                                                    className="col-span-5 bg-[#ffffff]/5 border border-[#ffffff]/10 px-3 py-2 font-headline text-[10px] uppercase tracking-widest outline-none focus:border-[#b90c1b]"
                                                />
                                                <input
                                                    value={spec.value}
                                                    onChange={(e) => {
                                                        const next = [...specifications];
                                                        next[index] = { ...next[index], value: e.target.value };
                                                        setSpecifications(next);
                                                    }}
                                                    placeholder="Value"
                                                    className="col-span-6 bg-[#ffffff]/5 border border-[#ffffff]/10 px-3 py-2 font-headline text-[10px] uppercase tracking-widest outline-none focus:border-[#b90c1b]"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const confirmed = window.confirm('Remove this specification row?');
                                                        if (!confirmed) return;
                                                        setSpecifications((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
                                                    }}
                                                    className="col-span-1 border border-[#ffffff]/15 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="pt-6 space-y-8">
                                    <h3 className="font-brand text-3xl uppercase">Color Variants + Images + Stock</h3>
                                    <p className="font-headline text-xs uppercase tracking-widest opacity-60">Each color needs exactly 5 images and size-wise stock. Enter key proceeds step.</p>

                                    {variants.map((variant, variantIndex) => (
                                        <div key={variantIndex} className="border border-[#ffffff]/10 p-5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-brand text-2xl uppercase">Color #{variantIndex + 1}</h4>
                                                <button
                                                    onClick={() => {
                                                        const confirmed = window.confirm('Remove this color variant?');
                                                        if (!confirmed) return;
                                                        setVariants((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== variantIndex)));
                                                    }}
                                                    className="px-3 py-2 border border-[#ffffff]/15 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <input
                                                value={variant.color}
                                                onChange={(e) => {
                                                    const next = [...variants];
                                                    next[variantIndex] = { ...next[variantIndex], color: e.target.value };
                                                    setVariants(next);
                                                }}
                                                placeholder="Color name"
                                                className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 px-3 py-2 font-headline text-xs uppercase tracking-widest outline-none focus:border-[#b90c1b]"
                                            />

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">Size wise stock</p>
                                                    <button
                                                        onClick={() => {
                                                            const next = [...variants];
                                                            next[variantIndex] = {
                                                                ...next[variantIndex],
                                                                sizes: [...next[variantIndex].sizes, { label: 'M', stock: 0 }],
                                                            };
                                                            setVariants(next);
                                                        }}
                                                        className="px-3 py-1 border border-[#ffffff]/15 font-headline text-[10px] uppercase tracking-widest hover:border-[#b90c1b]"
                                                    >
                                                        Add Size
                                                    </button>
                                                </div>

                                                {variant.sizes.map((sizeRow, sizeIndex) => (
                                                    <div key={sizeIndex} className="grid grid-cols-12 gap-2">
                                                        <select
                                                            value={sizeRow.label}
                                                            onChange={(e) => {
                                                                const next = [...variants];
                                                                next[variantIndex].sizes[sizeIndex].label = e.target.value;
                                                                setVariants(next);
                                                            }}
                                                            className="col-span-6 bg-[#2a2929] text-[#fcf8f8] border border-[#ffffff]/20 px-3 py-2 font-headline text-[10px] uppercase tracking-widest outline-none focus:border-[#b90c1b]"
                                                        >
                                                            {SIZE_OPTIONS.map((sizeOption) => (
                                                                <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="number"
                                                            value={sizeRow.stock}
                                                            onChange={(e) => {
                                                                const next = [...variants];
                                                                next[variantIndex].sizes[sizeIndex].stock = Number(e.target.value || 0);
                                                                setVariants(next);
                                                            }}
                                                            className="col-span-5 bg-[#ffffff]/5 border border-[#ffffff]/10 px-3 py-2 font-headline text-[10px] outline-none focus:border-[#b90c1b]"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const confirmed = window.confirm('Remove this size row?');
                                                                if (!confirmed) return;

                                                                const next = [...variants];
                                                                next[variantIndex].sizes = next[variantIndex].sizes.filter((_, i) => i !== sizeIndex);
                                                                if (!next[variantIndex].sizes.length) next[variantIndex].sizes = [{ label: 'M', stock: 0 }];
                                                                setVariants(next);
                                                            }}
                                                            className="col-span-1 border border-[#ffffff]/15 font-headline text-[10px] uppercase hover:border-[#b90c1b]"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-3">
                                                <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">Images (exactly 5)</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => addVariantImages(variantIndex, Array.from(e.target.files || []))}
                                                    className="w-full bg-[#ffffff]/5 border border-[#ffffff]/10 px-3 py-2 font-headline text-[10px]"
                                                />
                                                <p className="font-headline text-[10px] uppercase tracking-widest opacity-40">
                                                    Existing: {variant.existingImages.length} | New: {variant.newImages.length} | Total: {variant.existingImages.length + variant.newImages.length}/5
                                                </p>

                                                {!!variant.existingImages.length && (
                                                    <div>
                                                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-50 mb-2">Existing Images</p>
                                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                                            {variant.existingImages.map((imageUrl, imageIndex) => (
                                                                <div key={`${imageUrl}-${imageIndex}`} className="relative border border-[#ffffff]/10 bg-[#111]">
                                                                    <Image src={imageUrl} alt={`Existing ${imageIndex + 1}`} width={200} height={96} unoptimized className="w-full h-24 object-cover" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeExistingVariantImage(variantIndex, imageIndex)}
                                                                        className="absolute top-1 right-1 px-2 py-1 text-[10px] bg-black/70 border border-[#ffffff]/20 hover:border-[#b90c1b]"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {!!variant.newImages.length && (
                                                    <div>
                                                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-50 mb-2">New Images</p>
                                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                                            {variant.newImages.map((file, imageIndex) => (
                                                                <div key={`${file.name}-${imageIndex}`} className="relative border border-[#ffffff]/10 bg-[#111] p-2">
                                                                    <p className="font-headline text-[10px] uppercase tracking-widest truncate">{file.name}</p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeNewVariantImage(variantIndex, imageIndex)}
                                                                        className="mt-2 px-2 py-1 text-[10px] border border-[#ffffff]/20 hover:border-[#b90c1b]"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setVariants((prev) => [...prev, createEmptyVariant()])}
                                        className="px-4 py-2 border border-[#ffffff]/20 font-headline text-xs uppercase tracking-widest hover:border-[#b90c1b]"
                                    >
                                        Add Color Variant
                                    </button>

                                    <div className="bg-[#ffffff]/5 border border-[#ffffff]/10 p-4">
                                        <p className="font-headline text-[10px] uppercase tracking-widest opacity-60">Total Stock</p>
                                        <p className="font-brand text-4xl uppercase">{totalStock}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-6 border-t border-[#ffffff]/10 mt-6">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                                        disabled={step === 1}
                                        className="px-4 py-2 border border-[#ffffff]/20 font-headline text-xs uppercase tracking-widest disabled:opacity-30 hover:border-[#b90c1b]"
                                    >
                                        Back
                                    </button>
                                    {step < 3 && (
                                        <button onClick={handleNext} className="px-4 py-2 border border-[#ffffff]/20 font-headline text-xs uppercase tracking-widest hover:border-[#b90c1b]">Next (Enter)</button>
                                    )}
                                </div>
                                {step === 3 && (
                                    <button
                                        onClick={saveProduct}
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-[#b90c1b] font-brand text-2xl uppercase disabled:opacity-60 hover:opacity-90"
                                    >
                                        {isSubmitting ? 'Publishing...' : editingProductId ? 'Update Product' : 'Publish Product'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
