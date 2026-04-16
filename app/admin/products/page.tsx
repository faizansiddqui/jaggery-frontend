'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
// import type { ReactElement } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useSiteSettings } from '@/app/context/SiteSettingsContext';
import {
    fetchAdminProductsLite,
    fetchAdminCategoriesTree,
    createAdminCategory,
    updateAdminCategory,
    deleteAdminProduct,
    createAdminProduct,
    updateAdminProduct,
} from '@/app/lib/apiClient';

type CategoryNode = {
    _id: string;
    id?: string;
    name: string;
    parent?: string | null;
    ancestors?: Array<{ _id: string; name: string }>;
    children?: CategoryNode[];
};

function normalizeCategoryNodes(raw: unknown[]): CategoryNode[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => {
        const r = item as Record<string, unknown>;
        const childRows = Array.isArray(r.children) ? r.children : [];
        const ancestorsRaw = Array.isArray(r.ancestors) ? r.ancestors : [];
        return {
            _id: String(r._id ?? r.id ?? ''),
            id: r.id != null ? String(r.id) : undefined,
            name: String(r.name ?? ''),
            parent: r.parent != null && r.parent !== '' ? String(r.parent) : null,
            ancestors: ancestorsRaw.map((a) => {
                const ar = a as Record<string, unknown>;
                return { _id: String(ar._id ?? ''), name: String(ar.name ?? '') };
            }),
            children: normalizeCategoryNodes(childRows as unknown[]),
        };
    });
}

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
    variants?: Array<{
        label: string;
        stock: number;
        price: number;
        originalPrice?: number;
        selling_price?: number;
    }>;
    ingredients?: Array<{ key: string; value: string }>;
    nutritions?: Array<{ key: string; value: string }>;
    key_highlights?: string[];
    specifications?: Array<{ key: string; value: string }>;
};

type IngredientRow = { key: string; value: string };
type NutritionRow = { key: string; value: string };
type WeightUnit = 'GM' | 'KG';

type VariantRow = {
    weight: string; // e.g., '250', '500', '1'
    weightUnit: WeightUnit;
    price: string;
    discountedPrice: string;
    stock: number;
    image: File | null;
    existingImage: string; // URL for existing image
};

const WEIGHT_UNIT_OPTIONS: WeightUnit[] = ['GM', 'KG'];
// const CATEGORY_LEVEL_LABELS = ['Category', 'Sub Category', 'Sub Child Category'];
const DESCRIPTION_MAX_LENGTH = 1200;
const INGREDIENTS_COUNT = 3;
const NUTRITIONS_COUNT = 5;
// const SKU_PATTERN = /^[A-Z]{2}-\d{3}$/;


const createEmptyVariant = (): VariantRow => ({
    weight: '',
    weightUnit: 'GM',
    price: '',
    discountedPrice: '',
    stock: 0,
    image: null,
    existingImage: '',
});

const createEmptyIngredient = (): IngredientRow => ({ key: '', value: '' });
const createEmptyNutrition = (): NutritionRow => ({ key: '', value: '' });

const categoryIdOf = (node: CategoryNode) => String(node._id || node.id || '');

const parseCategoryId = (value: ProductItem['catagory_id']) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value._id || '';
};

const findCategoryNameById = (nodes: CategoryNode[], categoryId: string): string | null => {
    if (!categoryId) return null;
    for (const node of nodes) {
        if (String(node._id || node.id || '') === String(categoryId)) {
            return node.name || null;
        }
        if (Array.isArray(node.children) && node.children.length) {
            const found = findCategoryNameById(node.children, categoryId);
            if (found) return found;
        }
    }
    return null;
};

const formatCurrency = (value?: number) => {
    const n = Number(value || 0);
    return Number.isFinite(n) ? n.toFixed(2) : '0.00';
};

// const toUpper = (value: string) => value.toUpperCase();

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

function renameCategoryInTree(nodes: CategoryNode[], categoryId: string, nextName: string): CategoryNode[] {
    return nodes.map((node) => {
        const currentId = String(node._id || node.id || '');
        const updatedChildren = Array.isArray(node.children)
            ? renameCategoryInTree(node.children, categoryId, nextName)
            : [];
        if (currentId === categoryId) {
            return { ...node, name: nextName, children: updatedChildren };
        }
        return { ...node, children: updatedChildren };
    });
}

function flattenCategoriesForSelect(nodes: CategoryNode[], depth = 0): Array<{ id: string; label: string }> {
    const rows: Array<{ id: string; label: string }> = [];
    nodes.forEach((node) => {
        const id = String(node._id || node.id || '');
        if (!id) return;
        const prefix = depth > 0 ? `${'— '.repeat(depth)}` : '';
        rows.push({ id, label: `${prefix}${node.name}` });
        if (Array.isArray(node.children) && node.children.length) {
            rows.push(...flattenCategoriesForSelect(node.children, depth + 1));
        }
    });
    return rows;
}

// function findPathToCategory(nodes: CategoryNode[], targetId: string): string[] {
//     if (!targetId) return [];
//     const paths = flattenCategoryPaths(nodes);
//     for (const path of paths) {
//         if (path.includes(targetId)) {
//             return path.slice(0, path.indexOf(targetId) + 1);
//         }
//     }
//     return [];
// }

// function getNodesAtDepth(nodes: CategoryNode[], selectedPath: string[], depth: number): CategoryNode[] {
//     if (depth === 0) {
//         return nodes.filter((n) => !n.parent && !(n.ancestors && n.ancestors.length > 0));
//     }
//     let current = nodes;
//     for (let d = 0; d < depth; d += 1) {
//         const selectedId = selectedPath[d];
//         const selectedNode = current.find((n) => categoryIdOf(n) === selectedId);
//         if (!selectedNode?.children?.length) return [];
//         current = selectedNode.children;
//     }
//     return current;
// }

// function findNodeByPath(nodes: CategoryNode[], path: string[]): CategoryNode | null {
//     let currentNodes = nodes;
//     let currentNode: CategoryNode | null = null;
//     for (const id of path) {
//         currentNode = currentNodes.find((n) => categoryIdOf(n) === id) || null;
//         if (!currentNode) return null;
//         currentNodes = currentNode.children || [];
//     }
//     return currentNode;
// }

// function findNamesByPath(nodes: CategoryNode[], path: string[]): string[] {
//     const names: string[] = [];
//     let currentNodes = nodes;
//     for (const id of path) {
//         const currentNode = currentNodes.find((n) => categoryIdOf(n) === id);
//         if (!currentNode) break;
//         names.push(currentNode.name);
//         currentNodes = currentNode.children || [];
//     }
//     return names;
// }

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

    // const [category, setCategory] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [renameCategoryName, setRenameCategoryName] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [highlights, setHighlights] = useState('');
    // Use VariantRow[] for variants
    const [variants, setVariants] = useState<VariantRow[]>([createEmptyVariant()]);

    // Add missing state
    const [sku, setSku] = useState('');
    const [ingredients, setIngredients] = useState<IngredientRow[]>(Array(INGREDIENTS_COUNT).fill(null).map(() => createEmptyIngredient()));
    const [nutritions, setNutritions] = useState<NutritionRow[]>(Array(NUTRITIONS_COUNT).fill(null).map(() => createEmptyNutrition()));
    // For flat category selection
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [descriptionTextLength, setDescriptionTextLength] = useState(0);

    const descriptionEditorRef = useRef<HTMLDivElement | null>(null);
    const lastValidDescriptionHtmlRef = useRef('');
    const savedSelectionRef = useRef<Range | null>(null);

    // Flat category model: categoryPath is used for UI, category is the selected leaf id

    const totalStock = useMemo(
        () => variants.reduce((acc, v) => acc + Number(v.stock || 0), 0),
        [variants]
    );
    const categoryOptions = useMemo(() => flattenCategoriesForSelect(categories), [categories]);

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
        setNewCategoryName('');
        setRenameCategoryName('');
        setName('');
        setDescription('');
        setHighlights('');
        setVariants([createEmptyVariant()]);
        setDescriptionTextLength(0);
        setSku('');
        setIngredients(Array(INGREDIENTS_COUNT).fill(null).map(() => createEmptyIngredient()));
        setNutritions(Array(NUTRITIONS_COUNT).fill(null).map(() => createEmptyNutrition()));
        setSelectedCategoryId('');
        lastValidDescriptionHtmlRef.current = '';
        setError('');
    };

    useEffect(() => {
        const currentName = findCategoryNameById(categories, selectedCategoryId);
        // Only prefill when renaming is not being actively typed (keeps user edits intact).
        if (currentName && renameCategoryName.trim() === '') {
            setRenameCategoryName(currentName);
        }
    }, [categories, selectedCategoryId]); 

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
            const [liteProducts, categories] = await Promise.all([
                fetchAdminProductsLite(),
                fetchAdminCategoriesTree(),
            ]);
            // Map AdminProductLite to ProductItem shape for compatibility
            const mappedProducts = liteProducts.map((p) => ({
                _id: p._id,
                product_id: p.product_id ?? 0,
                name: p.name || '',
                title: p.title || p.name || '',
                sku: p.sku,
                description: p.description,
                key_highlights: p.key_highlights,
                ingredients: p.ingredients,
                nutritions: p.nutritions,
                catagory_id: p.catagory_id,
                variants: p.variants,
                product_image: p.product_image || (p.image ? [p.image] : []),
                price: p.price,
                selling_price: p.selling_price,
                quantity: p.quantity,
                status: p.status,
            }));
            setProducts(mappedProducts);
            setCategories(normalizeCategoryNodes(categories as unknown[]));
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

        // Wait for products to load before handling edit mode
        if (loading) return;

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
                    
                    // Set key highlights
                    if (Array.isArray(product.key_highlights) && product.key_highlights.length) {
                        setHighlights(product.key_highlights.join('\n'));
                    } else {
                        setHighlights('');
                    }

                    const ingredientRows = Array.isArray(product.ingredients) && product.ingredients.length
                        ? product.ingredients.map((s: Record<string, unknown>) => ({ key: String(s.key || ''), value: String(s.value || '') }))
                        : Array(INGREDIENTS_COUNT).fill(null).map(() => createEmptyIngredient());
                    setIngredients(ingredientRows);

                    const nutritionRows = Array.isArray(product.nutritions) && product.nutritions.length
                        ? product.nutritions.map((s: Record<string, unknown>) => ({ key: String(s.key || ''), value: String(s.value || '') }))
                        : Array(NUTRITIONS_COUNT).fill(null).map(() => createEmptyNutrition());
                    setNutritions(nutritionRows);

                    // Flat category: just set selectedCategoryId
                    const productCategoryId = parseCategoryId(product.catagory_id);
                    setSelectedCategoryId(productCategoryId);

                    // Map variants from backend format to frontend format
                    const mappedVariants: VariantRow[] = Array.isArray(product.variants) && product.variants.length
                        ? product.variants.map((v: Record<string, unknown>) => {
                            const label = String(v.label || '');
                            // Parse label to extract weight and unit (e.g., "500g" -> weight="500", unit="GM")
                            let weight = '';
                            let weightUnit: WeightUnit = 'GM';
                            if (label) {
                                const match = label.match(/^(\d+)([a-zA-Z]+)$/);
                                if (match) {
                                    weight = match[1];
                                    weightUnit = match[2].toUpperCase() as WeightUnit;
                                } else {
                                    weight = label;
                                }
                            }
                            return {
                                weight,
                                weightUnit,
                                price: String(v.price || ''),
                                discountedPrice: String(v.originalPrice || v.selling_price || ''),
                                stock: Number(v.stock || 0),
                                image: null,
                                existingImage: String(v.image || ''),
                            };
                        })
                        : [createEmptyVariant()];
                    setVariants(mappedVariants);
                    setError('');
                }
            }
        }
    }, [searchParams, products, categories, loading]);

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
            const target = products.find((p) => p.product_id === productId);
            await deleteAdminProduct(productId, target?._id);
            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed. Please try again.');
        }
    };

    const addChildCategory = async () => {
        const nameValue = newCategoryName.trim();
        if (!nameValue) return;
        try {
            await createAdminCategory(nameValue, selectedCategoryId || undefined);
            setNewCategoryName('');
            await loadData();
        } catch {
            setError('Category create failed. Name may already exist at this level.');
        }
    };

    const renameSelectedCategory = async () => {
        const nextName = renameCategoryName.trim();
        if (!selectedCategoryId) {
            setError('Select a category.');
            return;
        }
        if (!nextName) {
            setError('Enter a new category name.');
            return;
        }

        try {
            setError('');
            await updateAdminCategory(selectedCategoryId, nextName);
            setCategories((prev) => renameCategoryInTree(prev, selectedCategoryId, nextName));
            await loadData();
            // Keep the new value visible even after refresh.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Category rename failed.');
        }
    };

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!selectedCategoryId) return 'Select a category.';
            return '';
        }
        // ...existing validation for other steps (to be updated in next steps)...
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
            form.append('name', name.trim());
            form.append('title', name.trim());
            form.append('description', description);
            form.append('categoryId', selectedCategoryId);
            form.append('status', 'published');
            form.append('draft_stage', 'complete');
            form.append('key_highlights', highlights);
            form.append('sku', sku);
            form.append('ingredients', JSON.stringify(ingredients.filter(i => i.key.trim() && i.value.trim())));
            form.append('nutritions', JSON.stringify(nutritions.filter(n => n.key.trim() && n.value.trim())));
            
            // Transform variants to backend format: label (e.g., "500g", "1kg")
            const backendVariants = variants.map((v) => ({
                label: v.weight.trim() + v.weightUnit, // e.g., "500g", "1kg"
                stock: Number(v.stock || 0),
                price: Number(v.price || 0),
                originalPrice: Number(v.discountedPrice || 0) || Number(v.price || 0),
                selling_price: Number(v.discountedPrice || 0) || Number(v.price || 0),
                image: v.existingImage, // Keep existing image if any
            }));
            form.append('variants', JSON.stringify(backendVariants));
            
            // Send per-variant images along with their source variant indexes
            // so backend can map files to the correct variant rows.
            const variantImageIndexes: number[] = [];
            variants.forEach((v, index) => {
                if (v.image) {
                    form.append('variantImages', v.image);
                    variantImageIndexes.push(index);
                }
            });
            if (variantImageIndexes.length > 0) {
                form.append('variantImageIndexes', JSON.stringify(variantImageIndexes));
            }

            if (editingProductId) {
                await updateAdminProduct(editingProductId, form);
            } else {
                await createAdminProduct(form);
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

    // Flat category dropdown
    const renderCategoryDropdown = () => (
        <div className="mb-6">
            <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">Category</label>
            <select
                value={selectedCategoryId}
                onChange={e => setSelectedCategoryId(e.target.value)}
                className="w-full bg-[#ffffff]/5 border border-primary px-4 py-3 font-headline text-xs tracking-widest outline-none focus:border-secondary"
            >
                <option value="">Select category</option>
                {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
            </select>
        </div>
    );

    return (
        <main className="p-3 md:p-10 bg-surface text-on-surface" onKeyDown={handleEnterToProceed}>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline/20 pb-6">
                <div className='text-left'>
                    <p className="font-headline text-[10px] tracking-[0.35em] text-secondary text-left">Admin Products</p>
                    <h1 className="font-brand text-5xl md:text-7xl tracking-tight leading-none mt-2 text-left text-primary">Inventory Control</h1>
                </div>
                <div className="flex items-center flex-col gap-3 w-full md:w-auto">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product id, name, sku"
                        className="flex-1 md:w-80 bg-surface-container border border-outline/20 px-4 py-3 font-headline text-xs tracking-widest outline-none focus:border-primary"
                    />
                    <button onClick={openNew} className="px-6 py-3 bg-primary text-on-primary font-brand text-xl hover:opacity-90 transition-opacity rounded">New Product</button>
                </div>
            </header>

            {error && <p className="mt-4 text-[#ffb5bc] font-headline text-xs tracking-widest">{error}</p>}

            <section className="mt-8 border border-outline/20 overflow-hidden bg-surface-container rounded-xl">
                <div className="grid grid-cols-12 gap-3 p-4 bg-surface-container-high font-headline text-[10px] tracking-widest opacity-60">
                    <div className="col-span-2">Product ID</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1">Stock</div>
                    <div className="col-span-1">Price</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {loading ? (
                    <div className="p-8 font-headline text-xs tracking-widest opacity-50">Loading...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 font-headline text-xs tracking-widest opacity-50">No products found.</div>
                ) : (
                    filteredProducts.map((product) => {
                        const categoryName = typeof product.catagory_id === 'object' ? product.catagory_id?.name || '-' : '-';
                        return (
                            <div key={product.product_id} className="grid grid-cols-12 gap-3 p-4 border-t border-outline/10 items-center hover:bg-surface-container-high">
                                <div className="col-span-2 font-headline text-xs">{product.product_code || product.product_id}</div>
                                <div className="col-span-3 font-brand text-xl leading-none text-primary">{product.name}</div>
                                <div className="col-span-2 font-headline text-[11px] opacity-70">{categoryName}</div>
                                <div className="col-span-1 font-headline text-xs">{product.quantity || 0}</div>
                                <div className="col-span-1 font-headline text-xs text-secondary">{currency}{formatCurrency(product.selling_price ?? product.price)}</div>
                                <div className="col-span-1 font-headline text-[10px]">{product.status || 'draft'}</div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <button onClick={() => openEdit(product)} className="px-3 py-2 border border-outline/15 font-headline text-[10px] tracking-widest hover:border-primary">Edit</button>
                                    <button onClick={() => deleteProduct(product.product_id)} className="px-3 py-2 border border-outline/15 font-headline text-[10px] tracking-widest hover:border-secondary">Delete</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {isEditorOpen && (
                <section className="fixed inset-0 bg-surface z-50 overflow-hidden p-2 md:p-6 overscroll-none">
                    <div className="max-w-7xl mx-auto h-full overflow-hidden">
                        <div className="bg-surface border border-primary p-6 md:p-8 h-full max-h-[96vh] overflow-y-auto overscroll-y-contain">
                            <div className="flex justify-between items-start gap-4 border-b border-primary/10 pb-4">
                                <div>
                                    <p className="font-headline text-[10px] tracking-[0.3em] text-[#b90c1b]">Step {step}/3</p>
                                    <h2 className="font-brand text-4xl md:text-5xl tracking-tight mt-2">{editingProductId ? 'Edit Product' : 'Create Product'}</h2>
                                </div>
                                <button onClick={closeEditor} className="font-headline text-xs tracking-widest border border-secondary px-3 py-2 hover:border-primary">Close</button>
                            </div>

                            {step === 1 && (
                                <div className="pt-6 space-y-6">
                                    <h3 className="font-brand text-3xl">Select Category</h3>
                                    {renderCategoryDropdown()}
                                    {selectedCategoryId ? (
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <input
                                                value={renameCategoryName}
                                                onChange={(e) => setRenameCategoryName(e.target.value)}
                                                placeholder="Rename selected category"
                                                className="flex-1 bg-[#ffffff]/5 border border-primary px-4 py-3 font-headline text-xs tracking-widest outline-none focus:border-[#b90c1b]"
                                            />
                                            <button
                                                type="button"
                                                onClick={renameSelectedCategory}
                                                className="px-5 py-3 bg-primary text-on-primary font-headline text-xs tracking-widest hover:opacity-90 transition-opacity rounded"
                                            >
                                                Rename Category
                                            </button>
                                        </div>
                                    ) : null}
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Add new category"
                                            className="flex-1 bg-[#ffffff]/5 border border-primary px-4 py-3 font-headline text-xs tracking-widest outline-none focus:border-[#b90c1b]"
                                        />
                                        <button onClick={addChildCategory} className="px-5 py-3 border border-primary/80 font-headline text-xs tracking-widest hover:border-secondary">Create Category</button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="pt-6 space-y-8">
                                    <h3 className="font-brand text-3xl">Core Info + Specs</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">Product Name</label>
                                            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#ffffff]/5 border border-primary/10 px-4 py-3 font-brand text-sm outline-none focus:border-[#b90c1b]" />
                                        </div>
                                        <div>
                                            <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">SKU Code</label>
                                            <input
                                                value={sku}
                                                onChange={(e) => setSku(normalizeSkuInput(e.target.value))}
                                                // placeholder="e.g. AB-001"
                                                maxLength={6}
                                                className="w-full bg-[#ffffff]/5 border border-primary/10 px-4 py-3 font-headline text-sm tracking-widest outline-none focus:border-[#b90c1b]"
                                            />
                                            <p className="mt-2 font-headline text-[10px] tracking-widest opacity-50">Format: AB-123</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">Description</label>
                                            <div className="border border-primary/10 bg-[#ffffff]/5">
                                                <div className="flex flex-wrap items-center gap-2 border-b border-primary/10 p-2">
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => applyDescriptionHeading('P')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">P</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => applyDescriptionHeading('H1')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">H1</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => applyDescriptionHeading('H2')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">H2</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => applyDescriptionHeading('H3')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">H3</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('bold')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">Bold</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('italic')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">Italic</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('underline')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">Underline</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('insertUnorderedList')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">UL</button>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('insertOrderedList')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">OL</button>
                                                    <label className="flex items-center gap-2 px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest cursor-pointer hover:border-[#b90c1b]">
                                                        Color
                                                        <input
                                                            type="color"
                                                            defaultValue="#1c1b1b"
                                                            onMouseDown={keepEditorSelectionOnToolbarMouseDown}
                                                            onChange={(e) => runDescriptionCommand('foreColor', e.target.value)}
                                                            className="h-4 w-6 bg-transparent border-0 p-0"
                                                        />
                                                    </label>
                                                    <button type="button" onMouseDown={keepEditorSelectionOnToolbarMouseDown} onClick={() => runDescriptionCommand('removeFormat')} className="px-2 py-1 border border-[#ffffff]/20 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]">Clear</button>
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
                                                <div className="flex justify-end px-3 py-2 border-t border-primary/10">
                                                    <p className={`font-headline text-[10px] tracking-widest ${descriptionTextLength > DESCRIPTION_MAX_LENGTH ? 'text-[#ffb5bc]' : 'opacity-60'}`}>
                                                        {descriptionTextLength}/{DESCRIPTION_MAX_LENGTH}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Ingredients Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-brand text-2xl">Ingredients</h4>
                                                <p className="font-headline text-[10px] tracking-widest opacity-60">{INGREDIENTS_COUNT} points required</p>
                                            </div>
                                            {ingredients.map((ingredient, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-3">
                                                    <input
                                                        value={ingredient.key}
                                                        onChange={(e) => {
                                                            const next = [...ingredients];
                                                            next[index] = { ...next[index], key: e.target.value };
                                                            setIngredients(next);
                                                        }}
                                                        placeholder="Ingredient name"
                                                        className="col-span-5 bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-[10px] tracking-widest outline-none focus:border-[#b90c1b]"
                                                    />
                                                    <input
                                                        value={ingredient.value}
                                                        onChange={(e) => {
                                                            const next = [...ingredients];
                                                            next[index] = { ...next[index], value: e.target.value };
                                                            setIngredients(next);
                                                        }}
                                                        placeholder="Details"
                                                        className="col-span-6 bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-[10px] tracking-widest outline-none focus:border-[#b90c1b]"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Nutritions Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-brand text-2xl">Nutrition Facts</h4>
                                                <p className="font-headline text-[10px] tracking-widest opacity-60">{NUTRITIONS_COUNT} points required</p>
                                            </div>
                                            {nutritions.map((nutrition, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-3">
                                                    <input
                                                        value={nutrition.key}
                                                        onChange={(e) => {
                                                            const next = [...nutritions];
                                                            next[index] = { ...next[index], key: e.target.value };
                                                            setNutritions(next);
                                                        }}
                                                        placeholder="Nutrient"
                                                        className="col-span-5 bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-[10px] tracking-widest outline-none focus:border-[#b90c1b]"
                                                    />
                                                    <input
                                                        value={nutrition.value}
                                                        onChange={(e) => {
                                                            const next = [...nutritions];
                                                            next[index] = { ...next[index], value: e.target.value };
                                                            setNutritions(next);
                                                        }}
                                                        placeholder="Value"
                                                        className="col-span-6 bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-[10px] tracking-widest outline-none focus:border-[#b90c1b]"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="pt-6 space-y-8">
                                    <h3 className="font-brand text-3xl">Weight Variants + Pricing + Stock</h3>
                                    <p className="font-headline text-xs tracking-widest opacity-60">Add weight-based variants with pricing and stock. Multiple variants supported.</p>

                                    {variants.map((variant, variantIndex) => (
                                        <div key={variantIndex} className="border border-primary/10 p-5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-brand text-2xl">Variant #{variantIndex + 1}</h4>
                                                <button
                                                    onClick={() => {
                                                        const confirmed = window.confirm('Remove this weight variant?');
                                                        if (!confirmed) return;
                                                        setVariants((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== variantIndex)));
                                                    }}
                                                    className="px-3 py-2 border border-[#ffffff]/15 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            {/* Weight Input */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">Weight Value</label>
                                                    <input
                                                        type="number"
                                                        value={variant.weight}
                                                        onChange={(e) => {
                                                            const next = [...variants];
                                                            next[variantIndex] = { ...next[variantIndex], weight: e.target.value };
                                                            setVariants(next);
                                                        }}
                                                        placeholder="e.g., 250, 500, 1"
                                                        className="w-full bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-xs outline-none focus:border-[#b90c1b]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">Weight Unit</label>
                                                    <select
                                                        value={variant.weightUnit}
                                                        onChange={(e) => {
                                                            const next = [...variants];
                                                            next[variantIndex] = { ...next[variantIndex], weightUnit: e.target.value as WeightUnit };
                                                            setVariants(next);
                                                        }}
                                                        className="w-full bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-xs tracking-widest outline-none focus:border-[#b90c1b]"
                                                    >
                                                        {WEIGHT_UNIT_OPTIONS.map((unit) => (
                                                            <option key={unit} value={unit}>{unit}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Pricing */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => {
                                                            const next = [...variants];
                                                            next[variantIndex] = { ...next[variantIndex], price: e.target.value };
                                                            setVariants(next);
                                                        }}
                                                        placeholder="Original price"
                                                        className="w-full bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-xs outline-none focus:border-[#b90c1b]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">Discounted Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={variant.discountedPrice}
                                                        onChange={(e) => {
                                                            const next = [...variants];
                                                            next[variantIndex] = { ...next[variantIndex], discountedPrice: e.target.value };
                                                            setVariants(next);
                                                        }}
                                                        placeholder="Selling price"
                                                        className="w-full bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-xs outline-none focus:border-[#b90c1b]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Stock */}
                                            <div>
                                                <label className="block font-headline text-[10px] tracking-widest opacity-60 mb-2">Stock Quantity</label>
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) => {
                                                        const next = [...variants];
                                                        next[variantIndex] = { ...next[variantIndex], stock: Number(e.target.value || 0) };
                                                        setVariants(next);
                                                    }}
                                                    placeholder="Available stock"
                                                    className="w-full bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-xs outline-none focus:border-[#b90c1b]"
                                                />
                                            </div>

                                            {/* Single Image Upload Per Variant */}
                                            <div className="space-y-2">
                                                <label className="block font-headline text-[10px] tracking-widest opacity-60">Variant Image (One per variant)</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        const next = [...variants];
                                                        // If user selects a new image, treat it as replacement:
                                                        // clear the existing image reference so backend can overwrite.
                                                        next[variantIndex] = {
                                                            ...next[variantIndex],
                                                            image: file,
                                                            existingImage: file ? '' : next[variantIndex].existingImage,
                                                        };
                                                        setVariants(next);
                                                    }}
                                                    className="w-full bg-[#ffffff]/5 border border-primary/10 px-3 py-2 font-headline text-[10px]"
                                                />
                                                {(variant.existingImage || variant.image) && (
                                                    <div className="mt-2">
                                                        <p className="font-headline text-[10px] tracking-widest opacity-50 mb-2">Current Image:</p>
                                                        {variant.image && (
                                                            <div className="relative inline-block border border-primary/10">
                                                                <img src={URL.createObjectURL(variant.image)} alt="New" className="w-48 h-48 object-cover" />
                                                            </div>
                                                        )}
                                                        {!variant.image && variant.existingImage && (
                                                            <div className="relative inline-block border border-primary/10">
                                                                <Image src={variant.existingImage} alt="Existing" width={192} height={192} unoptimized className="w-48 h-48 object-cover" />
                                                            </div>
                                                        )}

                                                        {(variant.existingImage || variant.image) && (
                                                            <div className="flex items-center mt-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const next = [...variants];
                                                                        next[variantIndex] = {
                                                                            ...next[variantIndex],
                                                                            existingImage: '',
                                                                            image: null,
                                                                        };
                                                                        setVariants(next);
                                                                    }}
                                                                    className="flex items-center px-3 py-2 border border-primary/15 font-headline text-[10px] tracking-widest hover:border-[#b90c1b]"
                                                                >
                                                                    <span className="material-symbols-outlined align-[-3px] mr-1 text-sm">delete</span>
                                                                    Remove Image
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Display Full Weight */}
                                            {variant.weight && (
                                                <div className="bg-[#ffffff]/5 border border-primary/10 p-3">
                                                    <p className="font-headline text-[10px] tracking-widest opacity-60">Full Weight Label:</p>
                                                    <p className="font-brand text-xl">{variant.weight}{variant.weightUnit}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setVariants((prev) => [...prev, createEmptyVariant()])}
                                        className="px-4 py-2 bg-primary text-on-primary border border-primary/10 font-headline text-xs tracking-widest hover:border-primary"
                                    >
                                        Add Weight Variant
                                    </button>

                                    <div className="bg-[#ffffff]/5 border border-primary/10 p-4">
                                        <p className="font-headline text-[10px] tracking-widest opacity-60">Total Stock</p>
                                        <p className="font-brand text-4xl">{totalStock}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-6 border-t border-primary/10 mt-6">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                                        disabled={step === 1}
                                        className="px-4 py-2 border border-secondary font-headline text-xs tracking-widest disabled:opacity-30 hover:border-primary"
                                    >
                                        Back
                                    </button>
                                    {step < 3 && (
                                        <button onClick={handleNext} className="px-4 py-2 border border-secondary font-headline text-xs tracking-widest hover:border-primary">Next (Enter)</button>
                                    )}
                                </div>
                                {step === 3 && (
                                    <button
                                        onClick={saveProduct}
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-primary text-on-primary border border-primary/10 font-brand text-2xl disabled:opacity-60 hover:opacity-90"
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
